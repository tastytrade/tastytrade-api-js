import SessionService from "../../../lib/services/session-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const sessionService = new SessionService(client)

describe('login', () => {
  it('responds with a 200', async function() {
    const response = await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
    expect(response["session-token"]).toBeTruthy()
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('loginWithRememberToken', ()=>{
  it('responds with a 200', async function() {
    const rememberToken = (await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!, true))["remember-token"]
    await sessionService.loginWithRememberToken(process.env.API_USERNAME!, rememberToken, true)
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('validate', ()=>{
  it('responds with a 200', async function() {
    await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
    const response = await sessionService.validate()
    expect(response.email).toBeTruthy()//not sure what to look for here. validate doesn't return much
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('logout', ()=>{
  it('responds with a 204', async function() {
    await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
    const response = await sessionService.logout()
    expect(response.status).toBe(204);
    expect(client.session.isValid).toBeFalsy()
  })
})
