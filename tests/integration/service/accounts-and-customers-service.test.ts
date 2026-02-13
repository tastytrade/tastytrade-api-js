import AccountsAndCustomersService from "../../../lib/services/accounts-and-customers-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const accountsAndCustomersService = new AccountsAndCustomersService(client)

describe('getCustomerAccounts', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getCustomerAccounts()
    expect(response.length).toBeGreaterThan(0)
    expect(response[0].account["account-number"]).toBeDefined();
    expect(response[0].account["margin-or-cash"]).toBeDefined();
    expect(response[0].account["regulatory-domain"]).toBeDefined();
  })
})

describe('getCustomerResource', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getCustomerResource()
    expect(response.id).toBe('me')
  })
})

describe('getCustomerAccountResources', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getCustomerAccountResources()
    expect(response.length).toBeGreaterThan(0)
    expect(response[0].account["account-number"]).toBeDefined();
    expect(response[0].account["margin-or-cash"]).toBeDefined();
    expect(response[0].account["regulatory-domain"]).toBeDefined();
  })
})

describe('getFullCustomerAccountResource', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getFullCustomerAccountResource(process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBeDefined();
    expect(response["margin-or-cash"]).toBeDefined();
  })
})

// describe('getApiQuoteToken', () => {
//   it('responds with the correct data', async function() {
//     const response = await accountsAndCustomersService.getApiQuoteToken()
//     expect(response.token).toBeDefined()
//   })
// })
