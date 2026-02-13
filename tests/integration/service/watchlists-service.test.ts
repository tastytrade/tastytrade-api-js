import WatchlistsService from "../../../lib/services/watchlists-service"
import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";

const client = new TastytradeHttpClient({
  baseUrl: process.env.BASE_URL!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN!,
  oauthScopes: ['read']
})
const watchlistsService = new WatchlistsService(client)

describe('getPairsWatchlists', () => {
  it('responds with the correct data', async function() {
    const response = await watchlistsService.getPairsWatchlists()
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getPairsWatchlist', () => {
  it('responds with the correct data', async function() {
    const pairsWatchlistName = ''
    const response = await watchlistsService.getPairsWatchlist(pairsWatchlistName)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getPublicWatchlists', () => {
  it('responds with the correct data', async function() {
    const response = await watchlistsService.getPublicWatchlists()
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getPublicWatchlist', () => {
  it('responds with the correct data', async function() {
    const watchlistName = 'tasty Hourly Top Equities'
    const response = await watchlistsService.getPublicWatchlist(watchlistName)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})

describe('getAllWatchlists', () => {
    it('responds with the correct data', async function() {
      const response = await watchlistsService.getAllWatchlists()
      expect(response).toBeDefined()
      //Not sure what else it should be checking.
    })
})

describe('getSingleWatchlist', () => {
  it('responds with the correct data', async function() {
    const watchlistName = ''
    const response = await watchlistsService.getSingleWatchlist(watchlistName)
    expect(response).toBeDefined()
    //Not sure what else it should be checking.
  })
})
