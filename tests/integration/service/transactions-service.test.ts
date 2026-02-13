import TransactionsService from "../../../lib/services/transactions-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const transactionsService = new TransactionsService(client)

describe('getTotalFees', () => {
  it('responds with the correct data', async function() {
    const response = await transactionsService.getTotalFees(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
  })
})

describe('getAccountTransactions', () => {
  it('responds with the correct data', async function() {
    const response = await transactionsService.getAccountTransactions(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined()
  })
})
