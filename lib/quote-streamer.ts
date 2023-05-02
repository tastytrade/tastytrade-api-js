import Feed, { EventType, IEvent } from '@dxfeed/api'
import _ from 'lodash'

export const SupportedEventTypes = [
  EventType.Quote,
  EventType.Trade,
  EventType.Summary,
  EventType.Greeks,
  EventType.Profile
]

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

  subscribe(dxfeedSymbol: string, eventHandler: (event: IEvent) => void): () => void {
    if (_.isNil(this.feed)) {
      return _.noop
    }

    return this.feed.subscribe(
      SupportedEventTypes,
      [dxfeedSymbol],
      eventHandler
    )
  }
}
