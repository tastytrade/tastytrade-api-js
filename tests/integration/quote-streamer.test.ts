import { TastytradeLogger } from "../../lib/logger";
import TastytradeHttpClient from "../../lib/services/tastytrade-http-client";
import AccountsAndCustomersService from "../../lib/services/accounts-and-customers-service";
import QuoteStreamer from "../../lib/quote-streamer";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const customerService = new AccountsAndCustomersService(client)
const quoteStreamer = new QuoteStreamer(customerService, new TastytradeLogger())


afterAll(async () => {
  await quoteStreamer.disconnect()
});

describe('subscribeToAccounts', () => {
  it('subscribes successfully', async function() {
    let eventCount = 0
    const eventPromise = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for quote update'));
      }, 3000); // Increased timeout to 3 seconds

      quoteStreamer.addEventListener(_event => {
        eventCount += 1
        clearTimeout(timeout)
        resolve()
      })
    })

    try {
      await quoteStreamer.connect()
      quoteStreamer.subscribe(['AAPL'])
      await eventPromise
      expect(eventCount).toBeGreaterThan(0)
    } finally {
      // Ensure cleanup happens even if test fails
      await quoteStreamer.disconnect()
    }
  }, 10000) // Set Jest timeout to 10 seconds
})
