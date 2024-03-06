import WebSocket from 'isomorphic-ws'
import _ from 'lodash'
import type { JsonMap, JsonValue } from './utils/json-util.js'
import { JsonBuilder } from './utils/json-util.js'
import TastytradeSession from './models/tastytrade-session.js'
import { MinTlsVersion } from './utils/constants.js'

export enum STREAMER_STATE {
  Open = 0,
  Closed = 1,
  Error = 2
}

enum MessageAction {
  ACCOUNT_SUBSCRIBE = 'account-subscribe',
  CONNECT = 'connect', // Send this instead of `account-subscribe`
  HEARTBEAT = 'heartbeat',
  PUBLIC_WATCHLISTS_SUBSCRIBE = 'public-watchlists-subscribe',
  QUOTE_ALERTS_SUBSCRIBE = 'quote-alerts-subscribe',
  USER_MESSAGE_SUBSCRIBE = 'user-message-subscribe'
}

const HEARTBEAT_INTERVAL = 20000 // 20 seconds

const SOURCE = 'tastytrade-api-js-sdk'

export type Disposer = () => void

export type StreamerStateObserver = (streamerState: STREAMER_STATE) => void

export type StreamerMessageObserver = (json: object) => void

const REQUEST_ID = 'request-id'

function removeElement<T>(array: T[], element: T): void {
  const index = array.indexOf(element)
  if (index < 0) {
    return
  }

  array.splice(index, 1)
}

export class AccountStreamer {
  private websocket: WebSocket | null = null
  private startResolve: ((result: boolean) => void) | null = null
  private startReject: ((reason?: any) => void) | null = null
  private requestCounter: number = 0
  private queued: string[] = []

  private heartbeatTimerId: number | NodeJS.Timeout | null = null

  lastCloseEvent: any = null
  lastErrorEvent: any = null
  private _streamerState: STREAMER_STATE = STREAMER_STATE.Closed

  private readonly streamerStateObservers: StreamerStateObserver[] = []

  private readonly streamerMessageObservers: StreamerMessageObserver[] = []

  private startPromise: Promise<boolean> | null = null

  private readonly requestPromises: Map<
    number,
    [(status: string) => void, (error: string) => void]
  > = new Map()

  private readonly logger = console

  /**
   * 
   * @param url Url of the account streamer service
   */
  constructor(private readonly url: string, private readonly session: TastytradeSession) {}

  get streamerState(): STREAMER_STATE {
    return this._streamerState
  }

  set streamerState(streamerState: STREAMER_STATE) {
    this._streamerState = streamerState

    this.streamerStateObservers.forEach(observer => {
      observer(streamerState)
    })
  }

  private get authToken() {
    return this.session.authToken
  }

  /**
   * Adds a custom callback that fires when the streamer state changes
   * @param observer 
   * @returns 
   */
  addStreamerStateObserver(observer: StreamerStateObserver): Disposer {
    this.streamerStateObservers.push(observer)

    return () => {
      removeElement(this.streamerStateObservers, observer)
    }
  }

  get isOpen(): boolean {
    return this.streamerState === STREAMER_STATE.Open
  }

  get isClosed(): boolean {
    return this.streamerState === STREAMER_STATE.Closed
  }

  get isError(): boolean {
    return this.streamerState === STREAMER_STATE.Error
  }

  /**
   * Entrypoint for beginning a websocket session
   * You must have a valid tastytrade authToken before calling this method
   * @returns Promise that resolves when the "opened" message is received (see handleOpen)
   */
  async start(): Promise<boolean> {
    if (this.startPromise !== null) {
      return this.startPromise
    }

    this.websocket = new WebSocket(this.url, [], {
      minVersion: MinTlsVersion // TLS Config
    })
    const websocket = this.websocket
    this.lastCloseEvent = null
    this.lastErrorEvent = null
    websocket.addEventListener('open', this.handleOpen)
    websocket.addEventListener('close', this.handleClose)
    websocket.addEventListener('error', this.handleError)
    websocket.addEventListener('message', this.handleMessage)

    this.logger.info('AccountStreamer - starting')
    this.startPromise = new Promise<boolean>((resolve, reject) => {
      this.startResolve = resolve
      this.startReject = reject
    })

    return this.startPromise
  }

  stop() {
    this.teardown()
  }

  private teardown() {
    const websocket = this.websocket
    if (websocket === null) {
      return
    }

    this.startPromise = null

    this.cancelHeartbeatTimer()

    websocket.close()
    websocket.removeEventListener('open', this.handleOpen)
    websocket.removeEventListener('close', this.handleClose)
    websocket.removeEventListener('message', this.handleMessage)
    websocket.removeEventListener('error', this.handleError)

    this.websocket = null

    this.logger.info('AccountStreamer - teardown')
    this.streamerState = STREAMER_STATE.Closed // Manually update status for convenience
  }

  readonly sendHeartbeat = () => {
    this.clearHeartbeatTimerId()
    this.send(new JsonBuilder({ action: MessageAction.HEARTBEAT }))
  }

  private scheduleHeartbeatTimer() {
    if (this.isHeartbeatScheduled) {
      // Heartbeat already scheduled
      return
    }

    this.logger.info('Scheduling heartbeat with interval: ', HEARTBEAT_INTERVAL)
    const scheduler = typeof window === 'undefined' ? setTimeout : window.setTimeout
    this.heartbeatTimerId = scheduler(
      this.sendHeartbeat,
      HEARTBEAT_INTERVAL
    )
  }

  get isHeartbeatScheduled() {
    return !_.isNil(this.heartbeatTimerId)
  }

  private cancelHeartbeatTimer() {
    if (!this.isHeartbeatScheduled) {
      return // Nothing to cancel
    }

    if (typeof window === 'undefined') {
      clearTimeout(this.heartbeatTimerId! as number)
    } else {
      clearTimeout(this.heartbeatTimerId! as NodeJS.Timeout)
    }

    this.clearHeartbeatTimerId()
  }

  private clearHeartbeatTimerId() {
    this.heartbeatTimerId = null
  }

  /**
   * Send a message via websocket
   * @param json JsonBuilder
   * @param includeSessionToken Attaches session token to message if true
   * @returns 
   */
  send(json: JsonBuilder, includeSessionToken = true): number {
    this.requestCounter += 1
    json.add(REQUEST_ID, this.requestCounter)
    json.add('source', SOURCE)

    if (includeSessionToken) {
      const sessionToken = this.authToken
      if (!sessionToken) {
        throw new Error('sessionToken not set')
      }

      json.add('auth-token', sessionToken)
    }

    const message = JSON.stringify(json.json)
    const websocket = this.websocket
    if (websocket === null) {
      // Queue up and send on open
      this.queued.push(message)
    } else {
      websocket.send(message)
    }

    return this.requestCounter
  }

  /**
   * Used by other methods to send a specific `action` message
   * @param action 
   * @param value 
   * @returns 
   */
  public subscribeTo(action: string, value?: JsonValue): number {
    const json = new JsonBuilder()
    json.add('action', action)
    if (!_.isUndefined(value)) {
      json.add('value', value)
    }
    return this.send(json)
  }

  /**
   * Subscribes to all user-level messages for given user external id
   * @param userExternalId "external-id" from login response
   * @returns Promise that resolves when ack is received
   */
  public subscribeToUser(userExternalId: string) {
    if (!userExternalId) {
      return
    }

    this.subscribeTo(MessageAction.USER_MESSAGE_SUBSCRIBE, userExternalId)
  }

  /**
   * Subscribes to all account-level messages for given account numbers
   * @param accountNumbers List of account numbers to subscribe to
   * @returns Promise that resolves when an ack is received
   */
  public async subscribeToAccounts(accountNumbers: string[]): Promise<string> {
    if (accountNumbers.length === 0) {
      return Promise.reject('no account numbers')
    }

    const value: JsonValue =
      accountNumbers.length > 1 ? accountNumbers : accountNumbers[0]
    const requestId = this.subscribeTo(MessageAction.CONNECT, value)

    return new Promise<string>((resolve, reject) => {
      this.requestPromises.set(requestId, [resolve, reject])
    })
  }

  private sendQueuedMessages() {
    const queued = this.queued
    if (queued.length === 0 || this.websocket === null) {
      return
    }

    const websocket = this.websocket
    queued.forEach(msg => {
      websocket.send(msg)
    })

    this.queued = []
  }

  private readonly handleOpen = (event: WebSocket.Event) => {
    if (this.startResolve === null) {
      return
    }

    this.logger.info('AccountStreamer opened', event)

    this.startResolve(true)
    this.startResolve = this.startReject = null

    this.streamerState = STREAMER_STATE.Open
    this.sendQueuedMessages()
    this.scheduleHeartbeatTimer()
  }

  private readonly handleClose = (event: WebSocket.CloseEvent) => {
    this.logger.info('AccountStreamer closed', event)
    if (this.websocket === null) {
      return
    }

    this.lastCloseEvent = event
    this.streamerState = STREAMER_STATE.Closed
    this.teardown()
  }

  private readonly handleError = (event: WebSocket.ErrorEvent) => {
    if (this.websocket === null) {
      return
    }

    this.logger.warn('AccountStreamer error', event)

    this.lastErrorEvent = event
    this.streamerState = STREAMER_STATE.Error

    if (this.startReject !== null) {
      this.startReject(new Error('Failed to connect'))
      this.startReject = this.startResolve = null
    }

    this.teardown()
  }

  private readonly handleMessage = (event: WebSocket.MessageEvent) => {
    const json = JSON.parse(event.data as string) as JsonMap

    if (json.results !== undefined) {
      const results: JsonValue[] = json.results as JsonValue[]
      for (const result of results) {
        this.handleOneMessage(result as JsonMap)
      }
    } else {
      this.handleOneMessage(json)
    }
  }

  addMessageObserver(observer: StreamerMessageObserver): Disposer {
    this.streamerMessageObservers.push(observer)

    return () => {
      removeElement(this.streamerMessageObservers, observer)
    }
  }

  private readonly handleOneMessage = (json: JsonMap) => {
    this.logger.info(json)

    const action = json.action as string
    this.streamerMessageObservers.forEach(observer => observer(json))
    if (action) {
      if (action === MessageAction.HEARTBEAT) {
        // schedule next heartbeat
        this.scheduleHeartbeatTimer()
      }

      const promiseCallbacks = this.requestPromises.get(
        json[REQUEST_ID] as number
      )
      if (promiseCallbacks) {
        const [resolve, reject] = promiseCallbacks
        const status = json.status as string
        if (status === 'ok') {
          resolve(json.action as string)
        } else {
          reject(json.message as string)
        }
      }

      return
    }
  }
}
