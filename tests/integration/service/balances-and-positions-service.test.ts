import BalancesAndPositionsService from "../../../lib/service/balances-and-positions-service";
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
import SessionService from "../../../lib/service/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const balancesAndPositionsService = new BalancesAndPositionsService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('getPositionsList', () => {
  it('responds with the correct data', async function() {
    const response = await balancesAndPositionsService.getPositionsList(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
     //Not sure what else it should be checking.
  })
})

describe('getAccountBalanceValues', () => {
  it('responds with the correct data', async function() {
    const response = await balancesAndPositionsService.getAccountBalanceValues(process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBeDefined();
    expect(response["cash-balance"]).toBeDefined();
    expect(response["available-trading-funds"]).toBeDefined();
  })
})

describe('getBalanceSnapshots', () => {
  it('responds with the correct data', async function() {
      const response = await balancesAndPositionsService.getBalanceSnapshots(process.env.API_ACCOUNT_NUMBER!)
      expect(response.length).toBeGreaterThan(0)
      expect(response[0]["account-number"]).toBeDefined();
      expect(response[0]["cash-balance"]).toBeDefined();
      expect(response[0]["available-trading-funds"]).toBeDefined();
  })
})
