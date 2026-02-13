import { AccountStreamer } from "../../lib/account-streamer";
import { TastytradeLogger } from "../../lib/logger";
import TastytradeHttpClient from "../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const accountStreamer = new AccountStreamer(process.env.STREAMER_URL!, client, new TastytradeLogger())

describe('subscribeToAccounts', () => {
  it('subscribes successfully', async function() {
    console.log(process.env.STREAMER_URL)
    console.log(process.env.API_ACCOUNT_NUMBER)
    await accountStreamer.start()
    await accountStreamer.subscribeToAccounts([process.env.API_ACCOUNT_NUMBER!])
  })
})
