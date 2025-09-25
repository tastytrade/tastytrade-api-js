import TastytradeHttpClient from "./services/tastytrade-http-client.js"
import { AccountStreamer, STREAMER_STATE, type Disposer, type StreamerStateObserver } from './account-streamer.js'
import _ from 'lodash'

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
import QuoteStreamer, { MarketDataSubscriptionType, CandleType } from "./quote-streamer.js"
import type AccessToken from "./models/access-token.js"

export type ClientConfig = {
  baseUrl: string,
  accountStreamerUrl: string,
  clientSecret?: string,
  refreshToken?: string,
  oauthScopes?: string[],
  logger?: Logger,
  logLevel?: LogLevel
  targetApiVersion?: string
}

export default class TastytradeClient {
  public static readonly ProdConfig: ClientConfig = {
    baseUrl: 'https://api.tastyworks.com',
    accountStreamerUrl: 'wss://streamer.tastyworks.com',
  }
  public static readonly SandboxConfig: ClientConfig = {
    baseUrl: 'https://api.cert.tastyworks.com',
    accountStreamerUrl: 'wss://streamer.cert.tastyworks.com',
  }
  public readonly logger: TastytradeLogger
  public readonly httpClient: TastytradeHttpClient

  public readonly accountStreamer: AccountStreamer
  public readonly quoteStreamer: QuoteStreamer

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
    this.logger = new TastytradeLogger(config.logger, config.logLevel)
    this.httpClient = new TastytradeHttpClient(config, this.logger)

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


    this.accountStreamer = new AccountStreamer(config.accountStreamerUrl, this.session, this.accessToken, this.logger)
    this.quoteStreamer = new QuoteStreamer(this.accountsAndCustomersService, this.logger)
  }

  public updateConfig(config: Partial<ClientConfig>) {
    this.httpClient.updateConfig(config)
    this.logger.updateConfig(config)
  }

  get session(): TastytradeSession {
    return this.httpClient.session
  }

  get accessToken(): AccessToken {
    return this.httpClient.accessToken
  }
}

export { MarketDataSubscriptionType, CandleType }
export { AccountStreamer, STREAMER_STATE, type Disposer, type StreamerStateObserver }
export { TastytradeLogger, LogLevel }
export type { Logger }