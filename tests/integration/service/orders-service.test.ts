import OrderService from "../../../lib/service/orders-service"
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
import SessionService from "../../../lib/service/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const orderService = new OrderService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

// OrderID ambiguous
// describe('getOrder', () => {
//   it('responds with the correct data', async function() {
//     const orderId = 10;
//     const response = await orderService.getOrder(process.env.API_ACCOUNT_NUMBER!, orderId)
//     expect(response).toBeDefined()
//     //Not sure what else it should be checking.
//   })
// })

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

// describe('getLiveOrdersForCustomer', () => {
//   it('responds with the correct data', async function() {
//     const response = await orderService.getLiveOrdersForCustomer(process.env.API_CUSTOMER_ID!)
//     expect(response).toBeDefined()
//     //Not sure what else it should be checking.
//   })
// })

// describe('getCustomerOrders', () => {
//   it('responds with the correct data', async function() {
//     const response = await orderService.getCustomerOrders(process.env.API_CUSTOMER_ID!)
//     expect(response).toBeDefined()
//     //Not sure what else it should be checking.
//   })
// })
