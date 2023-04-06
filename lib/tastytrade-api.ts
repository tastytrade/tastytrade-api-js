import TastytradeHttpClient from "./service/tastytrade-http-client"
//Services:
import SessionService from "./service/API_Documentation/session-service"
import AccountStatusService from "./service/API_Documentation/account-status-service"
import AccountsAndCustomersService from "./service/API_Documentation/accounts-and-customers-service"
import BalancesAndPositionsService from "./service/API_Documentation/balances-and-positions-service"
import InstrumentsService from "./service/API_Documentation/instruments-service"
import MarginRequirementsService from "./service/API_Documentation/margin-requirements-service"
import MarketMetricsService from "./service/API_Documentation/market-metrics-service"
import NetLiquidatingValueHistoryService from "./service/API_Documentation/net-liquidating-value-history-service"
import OrderService from "./service/API_Documentation/orders-service"
import RiskParametersService from "./service/API_Documentation/risk-parameters-service"
import SymbolSearchService from "./service/API_Documentation/symbol-search-service"
import TransactionsService from "./service/API_Documentation/transactions-service"
import WatchlistsService from "./service/API_Documentation/watchlists-service"
import { AccountStreamer, STREAMER_STATE, Disposer, StreamerStateObserver } from './account-streamer/account-streamer'

export default class TastytradeClient {
  private httpClient: TastytradeHttpClient | null = null

  public sessionService: SessionService
  public accountStatusService: AccountStatusService
  public accountsAndCustomersService: AccountsAndCustomersService
  public balancesAndPositionsService: BalancesAndPositionsService
  public instrumentsService: InstrumentsService
  public marginRequirementsService: MarginRequirementsService
  public marketMetricsService: MarketMetricsService
  public netLiquidatingValueHistoryService: NetLiquidatingValueHistoryService
  public orderService: OrderService
  public riskParametersService: RiskParametersService
  public symbolSearchService: SymbolSearchService
  public transactionsService: TransactionsService
  public watchlistsService: WatchlistsService

  constructor(baseUrl: string) {
    this.httpClient = new TastytradeHttpClient(baseUrl)
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
}

export { AccountStreamer, STREAMER_STATE, Disposer, StreamerStateObserver }