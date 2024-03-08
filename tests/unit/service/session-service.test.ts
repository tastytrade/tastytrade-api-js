import SessionService from "../../../lib/services/session-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import nock from 'nock'

const BaseUrl = 'https://fakeurl.org'

function stubLogin(responseData: any) {
  nock(BaseUrl)
  .post('/sessions')
  .reply(200, responseData)
}

describe('login', () => {
  const expectedToken = "uyGnM9HETekp4rgUMdAAhRgodUQ02oAW3gGN2h61e4gqxkSk0_ajqQ+C"
  const responseData = {
    "data": {
        "user": {
            "email": "fake-user@tastytrade.com",
            "external-id": "U8aacecd2-545f-4077-9d55-7ccd04cbbfea"
        },
        "session-token": expectedToken
    },
    "context": "/sessions"
  }

  it('sets the correct auth token', async function() {
    stubLogin(responseData)

    const client = new TastytradeHttpClient(BaseUrl)
    const sessionService = new SessionService(client)
    await sessionService.login('fakeusername', 'fakepassword')
    expect(client.session.authToken).toBe(expectedToken)
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('loginWithRememberToken', () => {
  const expectedToken = "uyGnM9HETekp4rgUMdAAhRgodUQ02oAW3gGN2h61e4gqxkSk0_ajqQ+C"
  const responseData = {
    "data": {
        "user": {
            "email": "fake-user@tastytrade.com",
            "external-id": "U8aacecd2-545f-4077-9d55-7ccd04cbbfea"
        },
        "remember-token": "AK-rKgllt-H-IBQ-kUa2cA8rt1j4a-nmc46AyVa6HrjPyF4oARrHPA",
        "session-token": expectedToken
    },
    "context": "/sessions"
  }

  it('sets the correct auth token', async function() {
    stubLogin(responseData)

    const client = new TastytradeHttpClient(BaseUrl)
    const sessionService = new SessionService(client)
    await sessionService.loginWithRememberToken('fakeUsername', 'fakeRememberToken')
    expect(client.session.authToken).toBe(expectedToken)
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('validate', () => {
  const expectedToken = "qFgr7sNaa5XtjRJiDu_efPIfthK_UJ6Wr0OQLyPa_MF-a353CWP5wA+C"

  it('sets the correct auth token', async function() {
    nock(BaseUrl)
      .post('/sessions/validate')
      .reply(200, {
        "data": {
            "email": "fakeuser",
            "username": "fakeuser",
            "external-id": "U12345",
            "is-confirmed": true
        }
    })

    const client = new TastytradeHttpClient(BaseUrl)
    client.session.authToken = expectedToken
    const sessionService = new SessionService(client)
    await sessionService.validate()
    expect(client.session.authToken).toBe(expectedToken)
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('logout', () => {
  it('sets the correct auth token', async function() {
    nock(BaseUrl)
      .delete('/sessions')
      .reply(204, {})
    const client = new TastytradeHttpClient(BaseUrl)
    client.session.authToken = 'faketoken'
    const sessionService = new SessionService(client)
    await sessionService.logout()
    expect(client.session.authToken).toBeNull()
  })
})
