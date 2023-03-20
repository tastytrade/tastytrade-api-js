import TastytradeSession from "../../../lib/models/tastytrade-session";
import SessionService from "../../../lib/service/session-service";
import _ from 'lodash'

describe('login', () => {
  it('responds with a 401', async function() {
    const session = new TastytradeSession()
    const sessionService = new SessionService(session)
    try {
      await sessionService.login('fakeusername', 'fakepassword')
      throw new Error('Expected 401 but none was thrown')
    } catch(error: any) {
      expect(error.response.status).toBe(401)
      expect(session.isValid).toBeFalsy()
    }
  })
})