import TransactionsService from "../../../lib/service/transactions-service"
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
import SessionService from "../../../lib/service/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const transactionsService = new TransactionsService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

// Ignoring for now, need to create a transaction that won’t get purged from the cert environment
// describe('getEffectiveMarginRequirements', () => {
//   it('responds with a 404', async function() {
//     const client = new TastytradeHttpClient(process.env.BASE_URL!)
//       await transactionsService.getTransaction('fakeAccountNumber', 'fakeID')
//       throw new Error('Expected 404 but none was thrown')
//   })

//   it('responds with the correct data', async function() {
//     const client = new TastytradeHttpClient(process.env.BASE_URL!)
//     const response = await transactionsService.getTransaction(process.env.API_ACCOUNT_NUMBER!, process.env.API_ID!)
//     expect(response).toBeDefined()
//     //Not sure what else it should be checking.
//   })
// })

describe('getTotalFees', () => {
  it('responds with the correct data', async function() {
    const response = await transactionsService.getTotalFees(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getAccountTransactions', () => {
  it('responds with the correct data', async function() {
    const response = await transactionsService.getAccountTransactions(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})
