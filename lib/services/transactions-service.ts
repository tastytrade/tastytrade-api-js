import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class TransactionsService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Accounts:  Operations about Accounts
    async getTransaction(accountNumber: string, id: string){
        //Retrieve a transaction by account number and ID
        const symbolData =  (await this.httpClient.getData(`/accounts/${accountNumber}/transactions/${id}`, {}, {}))
        return extractResponseData(symbolData)
    }
    async getTotalFees(accountNumber: string){
        //Return the total fees for an account for a given day
        const totalFees =  (await this.httpClient.getData(`/accounts/${accountNumber}/transactions/total-fees`, {}, {}))
        return extractResponseData(totalFees)
    }

    //Transactions:  Operations about transactions
    async getAccountTransactions(accountNumber: string, queryParams = {}){
        //Returns a paginated list of the account's transactions (as identified by the provided authentication token) 
        //based on sort param. If no sort is passed in, it defaults to descending order.
        const accountTransactions =  (await this.httpClient.getData(`/accounts/${accountNumber}/transactions`, {}, queryParams))
        return extractResponseData(accountTransactions)
    }
}
