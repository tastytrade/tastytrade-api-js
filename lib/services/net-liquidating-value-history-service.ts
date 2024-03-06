import extractResponseData from "../utils/response-util.js";
import TastytradeHttpClient from "./tastytrade-http-client.js";

export default class NetLiquidatingValueHistoryService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Default
    async getNetLiquidatingValueHistory(accountNumber: string, queryParams = {}){
        //Returns a list of account net liquidating value snapshots.
        const netLiquidatingValueHistory = (await this.httpClient.getData(`/accounts/${accountNumber}/net-liq/history`, {}, queryParams))
        return extractResponseData(netLiquidatingValueHistory)
    }

    async getNetLiquidatingValue(accountNumber: string){
      //Returns a list of account net liquidating value snapshots.
      const netLiquidatingValue = await this.httpClient.getData(`/accounts/${accountNumber}/net-liq`)
      return extractResponseData(netLiquidatingValue)
  }
}
