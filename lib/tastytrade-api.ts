import TastytradeHttpClient from "./service/tastytrade-http-client"
//Services:
import SessionService from "./service/session-service"
import AccountStatusService from "./service/account-status-service"
import AccountsAndCustomersService from "./service/accounts-and-customers-service"
import BalancesAndPositionsService from "./service/balances-and-positions-service"
import InstrumentsService from "./service/instruments-service"
import MarginRequirementsService from "./service/margin-requirements-service"
import MarketMetricsService from "./service/market-metrics-service"
import NetLiquidatingValueHistoryService from "./service/net-liquidating-value-history-service"
import OrderService from "./service/orders-service"
import RiskParametersService from "./service/risk-parameters-service"
import SymbolSearchService from "./service/symbol-search-service"
import TransactionsService from "./service/transactions-service"
import WatchlistsService from "./service//watchlists-service"
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