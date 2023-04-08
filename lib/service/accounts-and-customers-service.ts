import extractResponseData from "../response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class AccountsAndCustomersService {
    constructor(private httpClient: TastytradeHttpClient) {
    }
    async getCustomerAccounts(){
        const accountNumber = (await this.httpClient.getData('/customers/me/accounts', {}, {})).data.data.items
        return extractResponseData(accountNumber)
    }

    //Customers: Operations about customers
    async getCustomerResource(customerId: string){
        //Get a full customer resource.
        const customerResource = (await this.httpClient.getData(`/customers/${customerId}`, {}, {}))
        return extractResponseData(customerResource)
    }
    async getCustomerAccountResources(customerId: string){
        //Get a list of all the customer account resources attached to the current customer.
        const customerAccountResources = (await this.httpClient.getData(`/customers/${customerId}/accounts`, {}, {}))
        return extractResponseData(customerAccountResources)
    }
    async getFullCustomerAccountResource(customerId: string, accountNumber: string){
        //Get a full customer account resource.
        const fullCustomerAccountResource = (await this.httpClient.getData(`/customers/${customerId}/accounts/${accountNumber}`, {}, {}))
        return extractResponseData(fullCustomerAccountResource)
    }

    //Quote-streamer-tokens: Operations about quote-streamer-tokens
    async getQuoteStreamerTokens(){
        //Returns the appropriate quote streamer endpoint, level and identification token for the current customer to receive market data.
        const quoteStreamerTokens = (await this.httpClient.getData('/quote-streamer-tokens', {}, {}))
        return extractResponseData(quoteStreamerTokens)
    }
}
