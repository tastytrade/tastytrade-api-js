import { AccountStreamer } from "../../lib/account-streamer";
import { TastytradeLogger } from "../../lib/logger";
import TastytradeHttpClient from "../../lib/services/tastytrade-http-client";
import SessionService from "../../lib/services/session-service";

const client = new TastytradeHttpClient({ baseUrl: process.env.BASE_URL! })
const accountStreamer = new AccountStreamer(process.env.STREAMER_URL!, client.session, client.accessToken, new TastytradeLogger())

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('subscribeToAccounts', () => {
  it('subscribes successfully', async function() {
    await accountStreamer.start()
    await accountStreamer.subscribeToAccounts([process.env.API_ACCOUNT_NUMBER!])
  })
})
