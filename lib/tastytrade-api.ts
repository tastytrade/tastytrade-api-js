import TastytradeHttpClient from "./services/tastytrade-http-client.js"
import { AccountStreamer, STREAMER_STATE, type Disposer, type StreamerStateObserver } from './account-streamer.js'
import MarketDataStreamer, { type CandleSubscriptionOptions, CandleType, MarketDataSubscriptionType, type MarketDataListener } from "./market-data-streamer.js"

//Services:
import SessionService from "./services/session-service.js"
import AccountStatusService from "./services/account-status-service.js"
import AccountsAndCustomersService from "./services/accounts-and-customers-service.js"
import BalancesAndPositionsService from "./services/balances-and-positions-service.js"
import InstrumentsService from "./services/instruments-service.js"
import MarginRequirementsService from "./services/margin-requirements-service.js"
import MarketMetricsService from "./services/market-metrics-service.js"
import NetLiquidatingValueHistoryService from "./services/net-liquidating-value-history-service.js"
import OrderService from "./services/orders-service.js"
import RiskParametersService from "./services/risk-parameters-service.js"
import SymbolSearchService from "./services/symbol-search-service.js"
import TransactionsService from "./services/transactions-service.js"
import WatchlistsService from "./services/watchlists-service.js"
import TastytradeSession from "./models/tastytrade-session.js"
import type Logger from "./logger.js"
import { TastytradeLogger, LogLevel } from "./logger.js"

export type ClientConfig = {
  baseUrl: string,
  accountStreamerUrl: string,
  logger?: Logger,
  logLevel?: LogLevel,
  sessionToken?: string
}

export default class TastytradeClient {
  public readonly logger: TastytradeLogger
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

  constructor(config: ClientConfig) {
    const { baseUrl, accountStreamerUrl, logger, logLevel, sessionToken } = config
    this.logger = new TastytradeLogger(logger, logLevel)
    this.httpClient = new TastytradeHttpClient({ baseUrl, sessionToken }, this.logger)
    this.accountStreamer = new AccountStreamer(accountStreamerUrl, this.session, this.logger)

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

export { MarketDataStreamer, MarketDataSubscriptionType, type MarketDataListener, type CandleSubscriptionOptions, CandleType }
export { AccountStreamer, STREAMER_STATE, type Disposer, type StreamerStateObserver }
export { TastytradeLogger, LogLevel }
export type { Logger }