import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class BalancesAndPositionsService {
    constructor(private httpClient: TastytradeHttpClient) {
    }
    
    //Positions: Operations about positions
    async getPositionsList(accountNumber: string, queryParams = {}){
        //Returns a list of the account's positions.
        //Can be filtered by symbol, underlying_symbol
        const positionsList = (await this.httpClient.getData(`/accounts/${accountNumber}/positions`, {}, queryParams))
        return extractResponseData(positionsList)
    }

    //Accounts: Operations about accounts
    async getAccountBalanceValues(accountNumber: string){
        //Returns the current balance values for an account
        const accountBalanceValues = (await this.httpClient.getData(`/accounts/${accountNumber}/balances`, {}, {}))
        return extractResponseData(accountBalanceValues)
    }

    //Balance-snapshots Operations about balance-snapshots
    async getBalanceSnapshots(accountNumber: string, queryParams = {}){
        //Returns most recent snapshot and current balance for an account
        const balanceSnapshot = (await this.httpClient.getData(`/accounts/${accountNumber}/balance-snapshots`, {}, queryParams))
        return extractResponseData(balanceSnapshot)
    }
}
