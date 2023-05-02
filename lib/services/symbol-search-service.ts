import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class SymbolSearchService {
    constructor(private httpClient: TastytradeHttpClient) {
    }
    
    //Default
    async getSymbolData(symbol: string){
        //Returns an array of symbol data.
        const symbolData =  (await this.httpClient.getData(`/symbols/search/${symbol}`, {}, {}))
        return extractResponseData(symbolData)
    }
}
