import RiskParametersService from "../../../lib/services/risk-parameters-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const riskParametersService = new RiskParametersService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

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
