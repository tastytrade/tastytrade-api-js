import TastytradeHttpClient from "../tastytrade-http-client";

export default class NetLiquidatingValueHistoryService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Default
    async getNetLiquidatingValueHistory(accountNumber: string, queryParams = {}){
        //Returns a list of account net liquidating value snapshots.
        const netLiquidatingValueHistory = (await this.httpClient.getData(`/accounts/${accountNumber}/net-liq/history`, {}, queryParams))
        return netLiquidatingValueHistory
    }
}
