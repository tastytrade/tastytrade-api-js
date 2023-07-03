import MarginRequirementsService from "../../../lib/services/margin-requirements-service";
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import SessionService from "../../../lib/services/session-service";

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const marginRequirementsService = new MarginRequirementsService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

describe('getMarginRequirements', function() {
  it('responds with the correct data', async function() {
    const response = await marginRequirementsService.getMarginRequirements(process.env.API_ACCOUNT_NUMBER!)
    expect(response).toBeDefined();
  })
})
