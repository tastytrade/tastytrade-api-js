import PopService, { Pop50Request } from "../../../lib/services/pop-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const popService = new PopService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

const req: Pop50Request = {
  "current-stock-price": 8.67,
  "current-time-at": new Date(),
  "histogram-ideal-range-count": 60,
  "initial-cost": 43,
  "initial-cost-effect": "Credit",
  "interest-rate": 0.05,
  "target-fraction-of-cost": 0.5,
  "volatility": 0.575123919,
  "legs": [
      {
          "action": "sell_to_open",
          "asset-type": "Equity Option",
          "call-or-put": "P",
          "days-to-expiration": 54,
          "quantity": 1,
          "strike-price": 8,
          "contract-implied-volatility": 0.558392479513946,
          "expiration-implied-volatility": 0.635073669
      }
  ],
  "source": "api-tests"
}

describe('get50Pop', () => {
  it('response has expected property with a known value', async function() {
    const response = await popService.get50Pop(req)
    expect(response["num-of-paths"]).toEqual(1000)
  })
})
