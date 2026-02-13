import AccountStatusService from "../../../lib/services/account-status-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const accountStatusService = new AccountStatusService(client)

describe('getAccountStatus', () => {
  it('responds with the correct data', async function() {
    const response = await accountStatusService.getAccountStatus(process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBeDefined();
    expect(response["equities-margin-calculation-type"]).toBeDefined();
  })
})
