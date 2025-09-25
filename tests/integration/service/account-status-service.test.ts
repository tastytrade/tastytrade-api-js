import AccountStatusService from "../../../lib/services/account-status-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";

const client = new TastytradeHttpClient({ baseUrl: process.env.BASE_URL! })
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
