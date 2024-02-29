import WebSocket from 'isomorphic-ws'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { MinTlsVersion } from './utils/constants.js'

export enum MarketDataSubscriptionType {
  Candle = 'Candle',
  Quote = 'Quote',
  Trade = 'Trade',
  Summary = 'Summary',
  Profile = 'Profile',
  Greeks = 'Greeks',
  Underlying = 'Underlying'
}

export enum CandleType {
  Tick = 't',
  Second = 's',
  Minute = 'm',
  Hour = 'h',
  Day = 'd',
  Week = 'w',
  Month = 'mo',
  ThirdFriday = 'o',
  Year = 'y',
  Volume = 'v',
  Price = 'p'
}

export type MarketDataListener = (data: any) => void
export type ErrorListener = (error: any) => void
export type AuthStateListener = (isAuthorized: boolean) => void

type QueuedSubscription = { symbol: string, subscriptionTypes: MarketDataSubscriptionType[], subscriptionArgs?: any }
type SubscriptionOptions = { subscriptionTypes: MarketDataSubscriptionType[], channelId: number, subscriptionArgs?: any }
export type CandleSubscriptionOptions = { period: number, type: CandleType, channelId: number }
type Remover = () => void

// List of all subscription types except for Candle
const AllSubscriptionTypes = Object.values(MarketDataSubscriptionType)

const KeepaliveInterval = 30000 // 30 seconds

const DefaultChannelId = 1

export default class MarketDataStreamer {
  private webSocket: WebSocket | null = null
  private token = ''
  private keepaliveIntervalId: any | null = null
  private dataListeners = new Map()
  private openChannels = new Set()
  private subscriptionsQueue: Map<number, QueuedSubscription[]> = new Map()
  private authState = ''
  private errorListeners = new Map()
  private authStateListeners = new Map()

  constructor() {
    console.warn('MarketDataStreamer is deprecated and will be removed in a future release of @tastytrade/api. Use @dxfeed/dxlink-api instead.')
  }

  addDataListener(dataListener: MarketDataListener, channelId: number | null = null): Remover {
    if (_.isNil(dataListener)) {
      return _.noop
    }
    const guid = uuidv4()
    this.dataListeners.set(guid, { listener: dataListener, channelId })

    return () => this.dataListeners.delete(guid)
  }

  addErrorListener(errorListener: ErrorListener): Remover {
    if (_.isNil(errorListener)) {
      return _.noop
    }
    const guid = uuidv4()
    this.errorListeners.set(guid, errorListener)

    return () => this.errorListeners.delete(guid)
  }

  addAuthStateChangeListener(authStateListener: AuthStateListener): Remover {
    if (_.isNil(authStateListener)) {
      return _.noop
    }
    const guid = uuidv4()
    this.authStateListeners.set(guid, authStateListener)

    return () => this.authStateListeners.delete(guid)
  }

  connect(url: string, token: string) {
    if (this.isConnected) {
      throw new Error('MarketDataStreamer is attempting to connect when an existing websocket is already connected')
    }

    this.token = token
    this.webSocket = new WebSocket(url, [], {
      minVersion: MinTlsVersion // TLS Config
    })
    this.webSocket.onopen = this.onOpen.bind(this)
    this.webSocket.onerror = this.onError.bind(this)
    this.webSocket.onmessage = this.handleMessageReceived.bind(this)
    this.webSocket.onclose = this.onClose.bind(this)
  }

  disconnect() {
    if (_.isNil(this.webSocket)) {
      return
    }

    this.clearKeepalive()

    this.webSocket.onopen = null
    this.webSocket.onerror = null
    this.webSocket.onmessage = null
    this.webSocket.onclose = null

    this.webSocket.close()
    this.webSocket = null

    this.openChannels.clear()
    this.subscriptionsQueue.clear()
    this.authState = ''
  }

  addSubscription(symbol: string, options = { subscriptionTypes: AllSubscriptionTypes, channelId: DefaultChannelId }): Remover {
    let { subscriptionTypes } = options
    // Don't allow candle subscriptions in this method. Use addCandleSubscription instead
    subscriptionTypes = _.without(subscriptionTypes, MarketDataSubscriptionType.Candle)

    const isOpen = this.isChannelOpened(options.channelId)
    if (isOpen) {
      this.sendSubscriptionMessage(symbol, subscriptionTypes, options.channelId, 'add')
    } else {
      this.queueSubscription(symbol, { subscriptionTypes, channelId: options.channelId })
    }

    return () => {
      this.removeSubscription(symbol, options)
    }
  }

  /**
   * Adds a candle subscription (historical data)
   * @param streamerSymbol Get this from an instrument's streamer-symbol json response field
   * @param fromTime Epoch timestamp from where you want to start
   * @param options Period and Type are the grouping you want to apply to the candle data
   * For example, a period/type of 5/m means you want each candle to represent 5 minutes of data
   * From there, setting fromTime to 24 hours ago would give you 24 hours of data grouped in 5 minute intervals
   * @returns 
   */
  addCandleSubscription(streamerSymbol: string, fromTime: number, options: CandleSubscriptionOptions) {
    const subscriptionTypes = [MarketDataSubscriptionType.Candle]
    const channelId = options.channelId ?? DefaultChannelId

    // Example: AAPL{=5m} where each candle represents 5 minutes of data
    const candleSymbol = `${streamerSymbol}{=${options.period}${options.type}}`
    const isOpen = this.isChannelOpened(channelId)
    const subscriptionArgs = { fromTime }
    if (isOpen) {
      this.sendSubscriptionMessage(candleSymbol, subscriptionTypes, channelId, 'add', subscriptionArgs)
    } else {
      this.queueSubscription(candleSymbol, { subscriptionTypes, channelId, subscriptionArgs })
    }

    return () => {
      this.removeSubscription(candleSymbol, { subscriptionTypes, channelId })
    }
  }

  removeSubscription(symbol: string, options = { subscriptionTypes: AllSubscriptionTypes, channelId: DefaultChannelId }) {
    const { subscriptionTypes, channelId } = options
    const isOpen = this.isChannelOpened(channelId)
    if (isOpen) {
      this.sendSubscriptionMessage(symbol, subscriptionTypes, channelId, 'remove')
    } else {
      this.dequeueSubscription(symbol, options)
    }
  }

  removeAllSubscriptions(channelId = DefaultChannelId) {
    const isOpen = this.isChannelOpened(channelId)
    if (isOpen) {
      this.sendMessage({ "type": "FEED_SUBSCRIPTION", "channel": channelId, reset: true })
    } else {
      this.subscriptionsQueue.set(channelId, [])
    }
  }

  openFeedChannel(channelId: number) {
    if (!this.isReadyToOpenChannels) {
      throw new Error(`Unable to open channel ${channelId} due to DxLink authorization state: ${this.authState}`)
    }

    if (this.isChannelOpened(channelId)) {
      return
    }

    this.sendMessage({
      "type": "CHANNEL_REQUEST",
      "channel": channelId,
      "service": "FEED",
      "parameters": {
        "contract": "AUTO"
      }
    })
  }

  isChannelOpened(channelId: number) {
    return this.isConnected && this.openChannels.has(channelId)
  }

  get isReadyToOpenChannels() {
    return this.isConnected && this.isDxLinkAuthorized
  }

  get isConnected() {
    return !_.isNil(this.webSocket)
  }

  private scheduleKeepalive() {
    this.keepaliveIntervalId = setInterval(this.sendKeepalive, KeepaliveInterval)
  }

  private sendKeepalive() {
    if (_.isNil(this.keepaliveIntervalId)) {
      return
    }

    this.sendMessage({
      "type": "KEEPALIVE",
      "channel": 0
    })
  }

  private queueSubscription(symbol: string, options: SubscriptionOptions) {
    const { subscriptionTypes, channelId, subscriptionArgs } = options
    let queue = this.subscriptionsQueue.get(options.channelId)
    if (_.isNil(queue)) {
      queue = []
      this.subscriptionsQueue.set(channelId, queue)
    }
    
    queue.push({ symbol, subscriptionTypes, subscriptionArgs })
  }

  private dequeueSubscription(symbol: string, options: SubscriptionOptions) {
    const queue = this.subscriptionsQueue.get(options.channelId)
    if (_.isNil(queue) || _.isEmpty(queue)) {
      return
    }

    _.remove(queue, (queueItem: any) => queueItem.symbol === symbol)
  }

  private sendQueuedSubscriptions(channelId: number) {
    const queuedSubscriptions = this.subscriptionsQueue.get(channelId)
    if (_.isNil(queuedSubscriptions)) {
      return
    }

    // Clear out queue immediately
    this.subscriptionsQueue.set(channelId, [])
    queuedSubscriptions.forEach(subscription => {
      this.sendSubscriptionMessage(subscription.symbol, subscription.subscriptionTypes, channelId, 'add', subscription.subscriptionArgs)
    })
  }

  /**
   * 
   * @param {*} symbol 
   * @param {*} subscriptionTypes 
   * @param {*} channelId 
   * @param {*} direction add or remove
   */
  private sendSubscriptionMessage(symbol: string, subscriptionTypes: MarketDataSubscriptionType[], channelId: number, direction: string, subscriptionArgs: any = {}) {
    const subscriptions = subscriptionTypes.map(type => (Object.assign({}, { "symbol": symbol, "type": type }, subscriptionArgs ?? {})))
    this.sendMessage({
      "type": "FEED_SUBSCRIPTION",
      "channel": channelId,
      [direction]: subscriptions
    })
  }

  private onError(error: any) {
    console.error('Error received: ', error)
    this.notifyErrorListeners(error)
  }

  private onOpen() {
    this.openChannels.clear()

    this.sendMessage({
      "type": "SETUP",
      "channel": 0,
      "keepaliveTimeout": KeepaliveInterval,
      "acceptKeepaliveTimeout": KeepaliveInterval,
      "version": "0.1-js/1.0.0"
    })

    this.scheduleKeepalive()
  }

  private onClose() {
    this.webSocket = null
    this.clearKeepalive()
  }

  private clearKeepalive() {
    if (!_.isNil(this.keepaliveIntervalId)) {
      clearInterval(this.keepaliveIntervalId)
    }

    this.keepaliveIntervalId = null
  }

  get isDxLinkAuthorized() {
    return this.authState === 'AUTHORIZED'
  }

  private handleAuthStateMessage(data: any) {
    this.authState = data.state
    this.authStateListeners.forEach(listener => listener(this.isDxLinkAuthorized))

    if (this.isDxLinkAuthorized) {
      this.openFeedChannel(DefaultChannelId)
    } else {
      this.sendMessage({
        "type": "AUTH",
        "channel": 0,
        "token": this.token
      })
    }
  }

  private handleChannelOpened(jsonData: any) {
    this.openChannels.add(jsonData.channel)
    this.sendQueuedSubscriptions(jsonData.channel)
  }

  private notifyListeners(jsonData: any) {
    this.dataListeners.forEach(listenerData => {
      if (listenerData.channelId === jsonData.channel || _.isNil(listenerData.channelId)) {
        listenerData.listener(jsonData)
      }
    })
  }

  private notifyErrorListeners(error: any) {
    this.errorListeners.forEach(listener => listener(error))
  }

  private handleMessageReceived(data: WebSocket.MessageEvent) {
    const messageData = _.get(data, 'data', '{}')
    const jsonData = JSON.parse(messageData as string)
    switch (jsonData.type) {
      case 'AUTH_STATE':
        this.handleAuthStateMessage(jsonData)
        break
      case 'CHANNEL_OPENED':
        this.handleChannelOpened(jsonData)
        break
      case 'FEED_DATA':
        this.notifyListeners(jsonData)
        break
    }
  }

  private sendMessage(json: object) {
    if (_.isNil(this.webSocket)) {
      return
    }

    this.webSocket.send(JSON.stringify(json))
  }
}