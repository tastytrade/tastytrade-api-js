import AccountsAndCustomersService from "../../../lib/services/accounts-and-customers-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const accountsAndCustomersService = new AccountsAndCustomersService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('getCustomerAccounts', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getCustomerAccounts()
    expect(response.length).toBeGreaterThan(0)
    expect(response[0].account["account-number"]).toBeDefined();
    expect(response[0].account["margin-or-cash"]).toBeDefined();
    expect(response[0].account["investment-objective"]).toBeDefined();
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
    expect(response[0].account["investment-objective"]).toBeDefined();
  })
})

describe('getFullCustomerAccountResource', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getFullCustomerAccountResource(process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBeDefined();
    expect(response["margin-or-cash"]).toBeDefined();
    expect(response["investment-objective"]).toBeDefined();
  })
})

describe('getApiQuoteToken', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getApiQuoteToken()
    expect(response.token).toBeDefined()
  })
})
