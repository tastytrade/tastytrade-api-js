import SessionService from "../../../lib/service/session-service";
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";

describe('login', () => {
  it('responds with a 401', async function() {
    const client = new TastytradeHttpClient(process.env.BASE_URL!)
    const sessionService = new SessionService(client)
    try {
      await sessionService.login('fakeusername', 'fakepassword')
      throw new Error('Expected 401 but none was thrown')
    } catch(error: any) {
      expect(error.response.status).toBe(401)
      expect(client.session.isValid).toBeFalsy()
    }
  })
})