import RiskParametersService from "../../../lib/services/risk-parameters-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const riskParametersService = new RiskParametersService(client)

describe('getEffectiveMarginRequirements', () => {
  it('responds with the correct data', async function() {
    const underlyingSymbol = 'AAPL'
    const response = await riskParametersService.getEffectiveMarginRequirements(process.env.API_ACCOUNT_NUMBER!, underlyingSymbol)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getPositionLimit', () => {
  it('responds with the correct data', async function() {
    const response = await riskParametersService.getPositionLimit(process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBe(process.env.API_ACCOUNT_NUMBER!)
  })
})
