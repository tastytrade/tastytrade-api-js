import OrderService from "../../../lib/services/orders-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const orderService = new OrderService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('getLiveOrders', () => {
  it('responds with the correct data', async function() {
    const response = await orderService.getLiveOrders(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getOrders', () => {
  it('responds with the correct data', async function() {
    const response = await orderService.getOrders(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})