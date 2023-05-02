import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

// create the central class that aggregates all services from dmoss
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
