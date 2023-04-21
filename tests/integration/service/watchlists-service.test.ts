import WatchlistsService from "../../../lib/service/watchlists-service"
import TastytradeHttpClient from "../../../lib/service/tastytrade-http-client";
import SessionService from "../../../lib/service/session-service";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new TastytradeHttpClient(process.env.BASE_URL!)
const watchlistsService = new WatchlistsService(client)

beforeAll(async () => {
  const sessionService = new SessionService(client)
  await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
});

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
