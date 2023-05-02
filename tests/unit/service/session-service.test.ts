import SessionService from "../../../lib/services/session-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import axios from 'axios'

jest.mock('axios')

describe('login', () => {
  const expectedToken = "uyGnM9HETekp4rgUMdAAhRgodUQ02oAW3gGN2h61e4gqxkSk0_ajqQ+C"
  const responseData = {
    "data": {
        "user": {
            "email": "devin.moss@tastytrade.com",
            "external-id": "U8aacecd2-545f-4077-9d55-7ccd04cbbfea"
        },
        "session-token": expectedToken
    },
    "context": "/sessions"
  }

  it('sets the correct auth token', async function() {
    (axios.request as jest.Mock).mockResolvedValue({ data: responseData })

    const client = new TastytradeHttpClient('fakeurl')
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
            "email": "devin.moss@tastytrade.com",
            "external-id": "U8aacecd2-545f-4077-9d55-7ccd04cbbfea"
        },
        "remember-token": "AK-rKgllt-H-IBQ-kUa2cA8rt1j4a-nmc46AyVa6HrjPyF4oARrHPA",
        "session-token": expectedToken
    },
    "context": "/sessions"
  }

  it('sets the correct auth token', async function() {
    (axios.request as jest.Mock).mockResolvedValue({ data: responseData })

    const client = new TastytradeHttpClient('fakeurl')
    const sessionService = new SessionService(client)
    await sessionService.loginWithRememberToken('fakeUsername', 'fakeRememberToken')
    expect(client.session.authToken).toBe(expectedToken)
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('validate', () => {
  const expectedToken = "qFgr7sNaa5XtjRJiDu_efPIfthK_UJ6Wr0OQLyPa_MF-a353CWP5wA+C"
  const responseData = {
    "data": {
        "email": "tastyworksmobileapp@gmail.com",
        "username": "tastyworksmobileapp",
        "external-id": "Ubbae143e-4def-4331-bd4f-c3fe51fbf766",
        "id": 269
    },
    "context": "/sessions/validate"
  }

  it('sets the correct auth token', async function() {
    (axios.request as jest.Mock).mockResolvedValue({ data: responseData })

    const client = new TastytradeHttpClient('fakeurl')
    client.session.authToken = expectedToken
    const sessionService = new SessionService(client)
    await sessionService.validate()
    expect(client.session.authToken).toBe(expectedToken)
    expect(client.session.isValid).toBeTruthy()
  })
})

describe('logout', () => {
  it('sets the correct auth token', async function() {
    (axios.request as jest.Mock).mockResolvedValue(null)
    const client = new TastytradeHttpClient('fakeurl')
    client.session.authToken = 'faketoken'
    const sessionService = new SessionService(client)
    const response = await sessionService.logout()
    expect(client.session.authToken).toBeNull()
  })
})
