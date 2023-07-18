import TastytradeHttpClient from "./services/tastytrade-http-client"
import { AccountStreamer, STREAMER_STATE, Disposer, StreamerStateObserver } from './account-streamer'
import MarketDataStreamer, { MarketDataSubscriptionType, MarketDataListener } from "./market-data-streamer"

//Services:
import SessionService from "./services/session-service"
import AccountStatusService from "./services/account-status-service"
import AccountsAndCustomersService from "./services/accounts-and-customers-service"
import BalancesAndPositionsService from "./services/balances-and-positions-service"
import InstrumentsService from "./services/instruments-service"
import MarginRequirementsService from "./services/margin-requirements-service"
import MarketMetricsService from "./services/market-metrics-service"
import NetLiquidatingValueHistoryService from "./services/net-liquidating-value-history-service"
import OrderService from "./services/orders-service"
import RiskParametersService from "./services/risk-parameters-service"
import SymbolSearchService from "./services/symbol-search-service"
import TransactionsService from "./services/transactions-service"
import WatchlistsService from "./services/watchlists-service"
import TastytradeSession from "./models/tastytrade-session"

export default class TastytradeClient {
  public readonly httpClient: TastytradeHttpClient

  public readonly accountStreamer: AccountStreamer

  public readonly sessionService: SessionService
  public readonly accountStatusService: AccountStatusService
  public readonly accountsAndCustomersService: AccountsAndCustomersService
  public readonly balancesAndPositionsService: BalancesAndPositionsService
  public readonly instrumentsService: InstrumentsService
  public readonly marginRequirementsService: MarginRequirementsService
  public readonly marketMetricsService: MarketMetricsService
  public readonly netLiquidatingValueHistoryService: NetLiquidatingValueHistoryService
  public readonly orderService: OrderService
  public readonly riskParametersService: RiskParametersService
  public readonly symbolSearchService: SymbolSearchService
  public readonly transactionsService: TransactionsService
  public readonly watchlistsService: WatchlistsService

  constructor(readonly baseUrl: string, readonly accountStreamerUrl: string) {
    this.httpClient = new TastytradeHttpClient(baseUrl)
    this.accountStreamer = new AccountStreamer(accountStreamerUrl, this.session)

    this.sessionService = new SessionService(this.httpClient)
    this.accountStatusService = new AccountStatusService(this.httpClient)
    this.accountsAndCustomersService = new AccountsAndCustomersService(this.httpClient)
    this.balancesAndPositionsService = new BalancesAndPositionsService(this.httpClient)
    this.instrumentsService = new InstrumentsService(this.httpClient)
    this.marginRequirementsService = new MarginRequirementsService(this.httpClient)
    this.marketMetricsService = new MarketMetricsService(this.httpClient)
    this.netLiquidatingValueHistoryService = new NetLiquidatingValueHistoryService(this.httpClient)
    this.orderService = new OrderService(this.httpClient)
    this.riskParametersService = new RiskParametersService(this.httpClient)
    this.symbolSearchService = new SymbolSearchService(this.httpClient)
    this.transactionsService = new TransactionsService(this.httpClient)
    this.watchlistsService = new WatchlistsService(this.httpClient)
  }

  get session(): TastytradeSession {
    return this.httpClient.session
  }
}

export { MarketDataStreamer, MarketDataSubscriptionType, MarketDataListener }
export { AccountStreamer, STREAMER_STATE, Disposer, StreamerStateObserver }
