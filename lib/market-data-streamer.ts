import WebSocket from 'isomorphic-ws'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

export enum MarketDataSubscriptionType {
  Quote = 'Quote',
  Trade = 'Trade',
  Summary = 'Summary',
  Profile = 'Profile',
  Greeks = 'Greeks',
  Underlying = 'Underlying'
}

export type MarketDataListener = (data: any) => void

type QueuedSubscription = { symbol: string, subscriptionTypes: MarketDataSubscriptionType[] }
type SubscriptionOptions = { subscriptionTypes: MarketDataSubscriptionType[], channelId: number }

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

  addDataListener(dataListener: MarketDataListener) {
    if (_.isNil(dataListener)) {
      return _.noop
    }
    const guid = uuidv4()
    this.dataListeners.set(guid, dataListener)

    return () => this.dataListeners.delete(guid)
  }

  connect(url: string, token: string) {
    if (this.isConnected) {
      throw new Error('MarketDataStreamer is attempting to connect when an existing websocket is already connected')
    }

    this.token = token
    this.webSocket = new WebSocket(url)
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

    this.webSocket.close()
    this.webSocket = null

    this.openChannels.clear()
    this.subscriptionsQueue.clear()
    this.authState = ''
  }

  // TODO: add listener to options, return unsubscriber
  addSubscription(symbol: string, options = { subscriptionTypes: AllSubscriptionTypes, channelId: DefaultChannelId }) {
    const { subscriptionTypes, channelId } = options
    const isOpen = this.isChannelOpened(channelId)
    if (isOpen) {
      this.sendSubscriptionMessage(symbol, subscriptionTypes, channelId, 'add')
    } else {
      this.queueSubscription(symbol, options)
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
    if (!this.isDxLinkAuthorized) {
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
    const { subscriptionTypes, channelId } = options
    let queue = this.subscriptionsQueue.get(options.channelId)
    if (_.isNil(queue)) {
      queue = []
      this.subscriptionsQueue.set(channelId, queue)
    }
    
    queue.push({ symbol, subscriptionTypes })
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
      this.sendSubscriptionMessage(subscription.symbol, subscription.subscriptionTypes, channelId, 'add')
    })
  }

  /**
   * 
   * @param {*} symbol 
   * @param {*} subscriptionTypes 
   * @param {*} channelId 
   * @param {*} direction add or remove
   */
  private sendSubscriptionMessage(symbol: string, subscriptionTypes: MarketDataSubscriptionType[], channelId: number, direction: string) {
    const subscriptions = subscriptionTypes.map(type => ({ "symbol": symbol, "type": type }))
    this.sendMessage({
      "type": "FEED_SUBSCRIPTION",
      "channel": channelId,
      [direction]: subscriptions
    })
  }

  private onError(error: any) {
    console.error('Error received: ', error)
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
    this.dataListeners.forEach(listener => listener(jsonData))
  }

  private handleMessageReceived(data: string) {
    const messageData = _.get(data, 'data', data)
    const jsonData = JSON.parse(messageData)
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