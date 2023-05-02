import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";
import _ from 'lodash'

export default class InstrumentsService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Instruments: Allows an API client to fetch data about instruments.
    async getCryptocurrencies(symbols: string[] = []){
        //Retrieve a set of cryptocurrencies given an array of one or more symbols.
        const queryParams = { symbol: symbols }
        const cryptocurrencies = (await this.httpClient.getData(`/instruments/cryptocurrencies`, {}, queryParams))
        return extractResponseData(cryptocurrencies)
    }
    async getSingleCryptocurrency(symbol: string){
        //Retrieve a cryptocurrency given a symbol.
        const encodedSymbol = encodeURIComponent(symbol)
        const singleCryptocurrency = (await this.httpClient.getData(`/instruments/cryptocurrencies/${encodedSymbol}`, {}, {}))
        return extractResponseData(singleCryptocurrency)
    }
    async getActiveEquities(queryParams = {}){
        //Returns all active equities in a paginated fashion
        const activeEquities = (await this.httpClient.getData(`/instruments/equities/active`, {}, queryParams))
        return extractResponseData(activeEquities)
    }
    async getEquityDefinitions(queryParams = {}){
        //Returns a set of equity definitions given an array of one or more symbols
        const equityDefinitions = (await this.httpClient.getData(`/instruments/equities`, {}, queryParams))
        return extractResponseData(equityDefinitions)
    }
    async getSingleEquity(symbol: string){
        //Returns a single equity definition for the provided symbol
        const singleEquity = (await this.httpClient.getData(`/instruments/equities/${symbol}`, {}, {}))
        return extractResponseData(singleEquity)
    }
    async getEquityOptions(symbols: string[], active = true, withExpired = false) {
        if (_.isEmpty(symbols)) {
          throw new Error('Symbols are required for InstrumentService.getEquityOptions')
        }

        //Returns a set of equity options given one or more symbols
        const queryParams = { symbols, active, withExpired }
        const equityOptions = (await this.httpClient.getData(`/instruments/equity-options`, {}, queryParams))
        return extractResponseData(equityOptions)
    }
    async getSingleEquityOption(symbol: string, queryParams = {}){
        //Get equity option by symbol
        const singleOption = await this.httpClient.getData(`/instruments/equity-options/${symbol}`, {}, queryParams)
        return extractResponseData(singleOption)
    }
    async getFutures(queryParams = {}){
        //Returns a set of outright futures given an array of one or more symbols.
        const futures = (await this.httpClient.getData(`/instruments/futures`, {}, queryParams))
        return extractResponseData(futures)
    }
    async getSingleFuture(symbol: string){
        //Returns an outright future given a symbol.
        const singleFuture = await this.httpClient.getData(`/instruments/futures/${symbol}`, {}, {})
        return extractResponseData(singleFuture)
    }
    async getFutureOptionsProducts(){
        //Returns metadata for all supported future option products
        const futureOptionsProducts = (await this.httpClient.getData(`/instruments/future-option-products`, {}, {}))
        return extractResponseData(futureOptionsProducts)
    }
    async getSingleFutureOptionProduct(exchange: string, rootSymbol: string){
        //Get a future option product by exchange and root symbol
        const singleFutureOptionProduct = (await this.httpClient.getData(`/instruments/future-option-products/${exchange}/${rootSymbol}`, {}, {}))
        return extractResponseData(singleFutureOptionProduct)
    }
    async getFutureOptions(queryParams = {}){
        //Returns a set of future option(s) given an array of one or more symbols.
        //Uses TW symbology: [./ESZ9 EW4U9 190927P2975]
        const futureOptions = (await this.httpClient.getData(`/instruments/future-options`, {}, queryParams))
        return extractResponseData(futureOptions)
    }
    async getSingleFutureOption(symbol: string){
        //Returns a future option given a symbol. Uses TW symbology: ./ESZ9 EW4U9 190927P2975
        const singleFutureOption = await this.httpClient.getData(`/instruments/future-options/${symbol}`, {}, {})
        return extractResponseData(singleFutureOption)
    }
    async getFuturesProducts(){
        //Returns metadata for all supported futures products
        const futuresProducts = (await this.httpClient.getData(`/instruments/future-products`, {}, {}))
        return extractResponseData(futuresProducts)
    }
    async getSingleFutureProduct(exchange: string, code: string){
        //Get future product from exchange and product code
        const singleFutureProduct = (await this.httpClient.getData(`/instruments/future-products/${exchange}/${code}`, {}, {}))
        return extractResponseData(singleFutureProduct)
    }
    async getQuantityDecimalPrecisions(){
        //Retrieve all quantity decimal precisions.
        const quantityDecimalPrecisions = (await this.httpClient.getData(`/instruments/quantity-decimal-precisions`, {}, {}))
        return extractResponseData(quantityDecimalPrecisions)
    }
    async getWarrants(queryParams = {}){
        //Returns a set of warrant definitions that can be filtered by parameters
        const warrants = (await this.httpClient.getData(`/instruments/warrants`, {}, queryParams))
        return extractResponseData(warrants)
    }
    async getSingleWarrant(symbol: string){
        //Returns a single warrant definition for the provided symbol
        const singleWarrant = (await this.httpClient.getData(`/instruments/warrants/${symbol}`, {}, {}))
        return extractResponseData(singleWarrant)
    }

    //Futures-option-chains: Allows an API client to fetch futures option chains.
    async getNestedFutureOptionChains(symbol: string){
        //Returns a futures option chain given a futures product code in a nested form to minimize redundant processing
        const nestedFutureOptionChains = (await this.httpClient.getData(`/futures-option-chains/${symbol}/nested`, {}, {}))
        return extractResponseData(nestedFutureOptionChains)
    }
    async getFutureOptionChain(symbol: string){
        //Returns a futures option chain given a futures product code, i.e. ES
        const futureOptionChain = (await this.httpClient.getData(`/futures-option-chains/${symbol}`, {}, {}))
        return extractResponseData(futureOptionChain)
    }

    //Option-chains: Allows an API client to fetch futures option chains.
    async getNestedOptionChain(symbol: string){
        //Returns an option chain given an underlying symbol,
        //i.e. AAPL in a nested form to minimize redundant processing
        const nestedOptionChain = (await this.httpClient.getData(`/option-chains/${symbol}/nested`, {}, {}))
        return extractResponseData(nestedOptionChain)
    }
    async getCompactOptionChain(symbol: string){
        //Returns an option chain given an underlying symbol, i.e. AAPL in a compact form to minimize content size
        const compactOptionChain = (await this.httpClient.getData(`/option-chains/${symbol}/compact`, {}, {}))
        return extractResponseData(compactOptionChain)
    }
    async getOptionChain(symbol: string){
        //Returns an option chain given an underlying symbol, i.e. AAPL
        const optionChain = (await this.httpClient.getData(`/option-chains/${symbol}`, {}, {}))
        return extractResponseData(optionChain)
    }
}
