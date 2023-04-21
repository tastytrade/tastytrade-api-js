import AccountStatusService from "../../../lib/service/account-status-service";
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
import SessionService from "../../../lib/service/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const accountStatusService = new AccountStatusService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('getAccountStatus', () => {
  it('responds with the correct data', async function() {
    const response = await accountStatusService.getAccountStatus(process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBeDefined();
    expect(response["equities-margin-calculation-type"]).toBeDefined();
  })
})
