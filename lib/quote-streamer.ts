import { DXLinkWebSocketClient, DXLinkFeed, FeedContract, FeedDataFormat, type DXLinkFeedEventListener } from '@dxfeed/dxlink-api'
import type AccountsAndCustomersService from './services/accounts-and-customers-service.js'
import type Logger from './logger.js'
import _ from 'lodash'

// TODO: Make sure this works in node and we don't have to override the global Websocket class

export enum MarketDataSubscriptionType {
  Candle = 'Candle',
  Quote = 'Quote',
  Trade = 'Trade',
  Summary = 'Summary',
  Profile = 'Profile',
  Greeks = 'Greeks',
  Underlying = 'Underlying'
}

const ALL_EVENT_TYPES = [
  MarketDataSubscriptionType.Quote,
  MarketDataSubscriptionType.Trade,
  MarketDataSubscriptionType.Summary,
  MarketDataSubscriptionType.Profile,
  MarketDataSubscriptionType.Greeks,
  MarketDataSubscriptionType.Underlying
]

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

export default class QuoteStreamer {
  public dxLinkFeed: DXLinkFeed<any> | null = null
  public dxLinkUrl: string | null = null
  public dxLinkAuthToken: string | null = null
  public eventListeners: DXLinkFeedEventListener[] = []

  constructor(private readonly accountsAndCustomersService: AccountsAndCustomersService, private readonly logger: Logger) {
  }

  /**
   * Connects to the DxLink WebSocket and sets up the feed
   * Make sure to call disconnect() when done
   * Calls `getApiQuoteToken` to get the connection URL and auth token
   * Make sure you have a valid session or access token before calling this
   */
  async connect() {
    const tokenResponse = await this.accountsAndCustomersService.getApiQuoteToken()
    this.dxLinkUrl = _.get(tokenResponse, 'dxlink-url')
    this.dxLinkAuthToken = _.get(tokenResponse, 'token')

    const client = new DXLinkWebSocketClient()
    client.connect(this.dxLinkUrl!)
    client.setAuthToken(this.dxLinkAuthToken!)

    this.dxLinkFeed = new DXLinkFeed(client, FeedContract.AUTO)

    this.dxLinkFeed.configure({
      acceptAggregationPeriod: 10,
      acceptDataFormat: FeedDataFormat.COMPACT
    })

    this.eventListeners.forEach(listener => this.dxLinkFeed!.addEventListener(listener))
  }

  disconnect() {
    if (_.isNil(this.dxLinkFeed)) {
      return
    }

    this.eventListeners.forEach(listener => this.removeEventListener(listener))
    this.dxLinkFeed = null
  }

  // Returns a function that can be called to remove the listener
  addEventListener(listener: DXLinkFeedEventListener): () => void {
    this.eventListeners.push(listener)
    if (this.dxLinkFeed) {
      this.dxLinkFeed.addEventListener(listener)
    }

    return () => {
      this.removeEventListener(listener)
    }
  }

  removeEventListener(listenerToRemove: DXLinkFeedEventListener) {
    _.remove(this.eventListeners, listener => listener === listenerToRemove)
    if (this.dxLinkFeed) {
      this.dxLinkFeed.removeEventListener(listenerToRemove)
    }
  }

  subscribe(streamerSymbols: string[], types: MarketDataSubscriptionType[] | null = null) {
    if (_.isNil(this.dxLinkFeed)) {
      throw new Error('DxLink feed is not connected')
    }

    types = types ?? ALL_EVENT_TYPES
    streamerSymbols.forEach(symbol => {
      types.forEach(type => {
        this.dxLinkFeed!.addSubscriptions({ type, symbol })
      })
    })
  }

  unsubscribe(streamerSymbols: string[]) {
    if (_.isNil(this.dxLinkFeed)) {
      throw new Error('DxLink feed is not connected')
    }

    streamerSymbols.forEach(symbol => {
      ALL_EVENT_TYPES.forEach(type => {
        this.dxLinkFeed!.removeSubscriptions({ type, symbol })
      })
    })
  }

  /**
   * Adds a candle subscription
   * @param streamerSymbol Get this from an instrument's streamer-symbol json response field
   * @param fromTime Epoch timestamp from where you want to start
   * @param period The duration of each candle
   * @param type The duration type of the period
   * For example, a period/type of 5/m means you want each candle to represent 5 minutes of data
   * From there, setting fromTime to 24 hours ago would give you 24 hours of data grouped in 5 minute intervals
   * @returns 
   */
  subscribeCandles(streamerSymbol: string, fromTime: number, period: number, type: CandleType) {
    // Example: AAPL{=5m} where each candle represents 5 minutes of data
    const candleSymbol = `${streamerSymbol}{=${period}${type}}`
    if (_.isNil(this.dxLinkFeed)) {
      throw new Error('DxLink feed is not connected')
    }

    this.dxLinkFeed!.addSubscriptions({
      type: MarketDataSubscriptionType.Candle,
      symbol: candleSymbol,
      fromTime
    })
  }
}