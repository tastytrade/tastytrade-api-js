import SymbolSearchService from "../../../lib/services/symbol-search-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const symbolSearchService = new SymbolSearchService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('getEffectiveMarginRequirements', () => {
  it('responds with the correct data', async function() {
    const equitySymbol = 'AAPL'
    const response = await symbolSearchService.getSymbolData(equitySymbol)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})
