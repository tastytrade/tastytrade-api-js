import OrderService from "../../../lib/services/orders-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const orderService = new OrderService(client)

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