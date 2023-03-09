import { toDxSymbol } from './dx-util'
import { parseSecurity } from './security'
import { IEvent } from '@dxfeed/api'
import _ from 'lodash'
import { QuoteStreamer as TTQuoteStreamer } from 'tt-market-data'

export default class QuoteStreamer {
  private streamer: TTQuoteStreamer | null = null

  constructor(private readonly token: string, private readonly url: string) {
    this.streamer = new TTQuoteStreamer(token, url)
  }

  connect() {
    this.streamer.connect()
  }

  disconnect() {
    this.streamer.disconnect()
  }

  subscribe(twSymbol: string, eventHandler: (event: IEvent) => void): () => void {
    const security = parseSecurity(twSymbol)
    if (_.isNil(security)) {
      throw `Unable to parse ${twSymbol}`
    }

    const dxSymbol = toDxSymbol(security)
    return this.streamer.subscribe(dxSymbol, eventHandler)
  }
}

const token = 'dGFzdHksbGl2ZSwsMTY3ODQ4MzE2MywxNjc4Mzk2NzYzLFUwMDAwMDM3MTg0.G0UkOAolWeWDLyStBcVdxbCxW3okbDeA4-RtAPnhOX0'
// const wsUrl = 'wss://tools.dxfeed.com/webservice/cometd'
const wsUrl = 'https://tasty-live-web.dxfeed.com/live/cometd'

export const streamer = new QuoteStreamer(token, wsUrl)