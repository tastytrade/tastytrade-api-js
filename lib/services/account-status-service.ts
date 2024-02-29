import extractResponseData from "../utils/response-util.js";
import TastytradeHttpClient from "./tastytrade-http-client.js";

// create the central class that aggregates all services
export default class AccountStatusService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Trading Status: Allows an API client to request information about the basic trade status of an account. This includes information about the strategies an account can trade. 
    async getAccountStatus(accountNumber: string){
        //Returns current trading status for an account.
        const accountStatus =  (await this.httpClient.getData(`/accounts/${accountNumber}/trading-status`, {}, {}))
        return extractResponseData(accountStatus)
    }
}
