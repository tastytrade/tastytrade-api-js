import Feed, { EventType, IEvent } from '@dxfeed/api'
import { toDxSymbol } from './dx-util'
import { parseSecurity } from './security'
import _ from 'lodash'

export default class QuoteStreamer {
  private feed: Feed | null = null

  constructor(private readonly token: string, private readonly url: string) {}

  connect() {
    this.feed = new Feed()
    this.feed.setAuthToken(this.token)
    this.feed.connect(this.url)
  }

  disconnect() {
    if (!_.isNil(this.feed)) {
      this.feed.disconnect()
    }
  }

  subscribe(twSymbol: string, eventHandler: (event: IEvent) => void): () => void {
    if (_.isNil(this.feed)) {
      return _.noop
    }

    const security = parseSecurity(twSymbol)
    if (_.isNil(security)) {
      throw `Unable to parse ${twSymbol}`
    }

    const dxSymbol = toDxSymbol(security)
    return this.feed.subscribe(
      [EventType.Quote],
      [dxSymbol],
      eventHandler
    )
  }
}

const token = 'dGFzdHksbGl2ZSwsMTY1MDk5NTQzOCwxNjUwOTA5MDM4LFUwMDAwMDM3MTg0.w3OJ6sG0P93nTL4hPu7xwtb-cUuY8EgUdHKQuTU_kxw'
const wsUrl = 'wss://tools.dxfeed.com/webservice/cometd'

export const streamer = new QuoteStreamer(token, wsUrl)