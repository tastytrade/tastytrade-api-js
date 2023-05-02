import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class MarketMetricsService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Default
    async getMarketMetrics(queryParams = {}){
        //Returns an array of volatility data for given symbols.
        const marketMetrics = (await this.httpClient.getData('/market-metrics', {}, queryParams))
        return extractResponseData(marketMetrics)
    }
    async getHistoricalDividendData(symbol: string){
        //Get historical dividend data
        const historicalDividendData = (await this.httpClient.getData(`/market-metrics/historic-corporate-events/dividends/${symbol}`, {}, {}))
        return extractResponseData(historicalDividendData)
    }
    async getHistoricalEarningsData(symbol: string, queryParams = {}){
        //Get historical earnings data
        const historicalEarningsData = (await this.httpClient.getData(`/market-metrics/historic-corporate-events/earnings-reports/${symbol}`, {}, queryParams))
        return extractResponseData(historicalEarningsData)
    }
}
