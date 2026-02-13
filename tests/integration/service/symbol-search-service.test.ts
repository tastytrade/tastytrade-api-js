import SymbolSearchService from "../../../lib/services/symbol-search-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const symbolSearchService = new SymbolSearchService(client)

describe('getEffectiveMarginRequirements', () => {
  it('responds with the correct data', async function() {
    const equitySymbol = 'AAPL'
    const response = await symbolSearchService.getSymbolData(equitySymbol)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})
