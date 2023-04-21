import AccountsAndCustomersService from "../../../lib/service/accounts-and-customers-service";
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
import SessionService from "../../../lib/service/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

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
    const response = await accountsAndCustomersService.getCustomerResource(process.env.API_CUSTOMER_ID!)
    expect(response.id).toBe(process.env.API_CUSTOMER_ID!)
  })
})

describe('getCustomerAccountResources', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getCustomerAccountResources(process.env.API_CUSTOMER_ID!)
    expect(response.length).toBeGreaterThan(0)
    expect(response[0].account["account-number"]).toBeDefined();
    expect(response[0].account["margin-or-cash"]).toBeDefined();
    expect(response[0].account["investment-objective"]).toBeDefined();
  })
})

describe('getFullCustomerAccountResource', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getFullCustomerAccountResource(process.env.API_CUSTOMER_ID!, process.env.API_ACCOUNT_NUMBER!)
    expect(response["account-number"]).toBeDefined();
    expect(response["margin-or-cash"]).toBeDefined();
    expect(response["investment-objective"]).toBeDefined();
  })
})

describe('getQuoteStreamerTokens', () => {
  it('responds with the correct data', async function() {
    const response = await accountsAndCustomersService.getQuoteStreamerTokens()
    expect(response.token).toBeDefined()
  })
})
