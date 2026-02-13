import MarginRequirementsService from "../../../lib/services/margin-requirements-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const marginRequirementsService = new MarginRequirementsService(client)

describe('getMarginRequirements', function() {
  it('responds with the correct data', async function() {
    const response = await marginRequirementsService.getMarginRequirements(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined();
  })
})
