import _ from 'lodash'
import type { JsonMap, JsonValue } from '../json-util'
import { JsonBuilder } from '../json-util'
import toast from 'react-hot-toast'

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

export type Disposer = () => void

export type StreamerStateObserver = (streamerState: STREAMER_STATE) => void

// Message `type` will be the data model
// i.e. a balance update message will be of type `AccountBalance`
export enum StreamerMessageType {
  Any = '*' /* get all messages */,
  AcatRequest = 'AcatRequest',
  AccountBalance = 'AccountBalance',
  AchRelationship = 'AchRelationship',
  BankingPreRegistration = 'BankingPreRegistration',
  CashAward = 'CashAward',
  CurrentPosition = 'CurrentPosition',
  CustomerAccountCreatedMessage = 'CustomerAccountCreatedMessage',
  DividendReinvestmentRequest = 'DividendReinvestmentRequest',
  ExternalInstitution = 'ExternalInstitution',
  ExternalTransaction = 'ExternalTransaction',
  FeatureEntitlement = 'FeatureEntitlement',
  Order = 'Order',
  PendingCashEntry = 'PendingCashEntry',
  StockAward = 'StockAward',
  TradingStatus = 'TradingStatus'
}

export type StreamerMessageObserver = (messageType: string, action: string, status: string) => void

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
  private requestCounter = 0
  private queued: string[] = []

  private heartbeatTimerId = 0

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

  public authToken: string = ''

  constructor(private readonly url: string) {}

  get streamerState(): STREAMER_STATE {
    return this._streamerState
  }

  set streamerState(streamerState: STREAMER_STATE) {
    this._streamerState = streamerState

    this.streamerStateObservers.forEach(observer => {
      observer(streamerState)
    })
  }

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

  async start(authToken: string): Promise<boolean> {
    this.authToken = authToken
    if (this.startPromise !== null) {
      return this.startPromise
    }

    const websocket = (this.websocket = new WebSocket(this.url))
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
    this.heartbeatTimerId = 0
    this.send(new JsonBuilder({ action: MessageAction.HEARTBEAT }))
  }

  private scheduleHeartbeatTimer() {
    if (this.heartbeatTimerId > 0) {
      // Heartbeat already scheduled
      return
    }

    this.logger.info('Scheduling heartbeat with interval: ', HEARTBEAT_INTERVAL)
    this.heartbeatTimerId = window.setTimeout(
      this.sendHeartbeat,
      HEARTBEAT_INTERVAL
    )
  }

  private cancelHeartbeatTimer() {
    if (this.heartbeatTimerId > 0) {
      clearTimeout(this.heartbeatTimerId)
      this.heartbeatTimerId = 0
    }
  }

  send(json: JsonBuilder, includeSessionToken = true): number {
    this.requestCounter += 1
    json.add(REQUEST_ID, this.requestCounter)
    json.add('source', 'demo')

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

  public subscribeTo(action: string, value?: JsonValue): number {
    const json = new JsonBuilder()
    json.add('action', action)
    if (!_.isUndefined(value)) {
      json.add('value', value)
    }
    return this.send(json)
  }

  public subscribeToUser(userExternalId: string) {
    if (!userExternalId) {
      return
    }

    this.subscribeTo(MessageAction.USER_MESSAGE_SUBSCRIBE, userExternalId)
  }

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

  private readonly handleOpen = (event: Event) => {
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

  private readonly handleClose = (event: CloseEvent) => {
    this.logger.info('AccountStreamer closed', event)
    if (this.websocket === null) {
      return
    }

    this.lastCloseEvent = event
    this.streamerState = STREAMER_STATE.Closed
    this.teardown()
  }

  private readonly handleError = (event: Event) => {
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

  private readonly handleMessage = (event: MessageEvent) => {
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
    this.streamerMessageObservers.forEach(observer => observer(json.type as string, action, json.status as string))
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

export const wsUrl = 'wss://streamer.cert.tastyworks.com'

export const accountStreamer = new AccountStreamer(wsUrl)