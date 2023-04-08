import SessionService from "../../../lib/service/session-service";
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
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
        "remember-token": "AK-rKgllt-H-IBQ-kUa2cA8rt1j4a-nmc46AyVa6HrjPyF4oARrHPA",
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