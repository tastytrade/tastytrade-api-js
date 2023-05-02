import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class RiskParametersService {
    constructor(private httpClient: TastytradeHttpClient) {
    }
    
    //Accounts: Operations about accounts
    async getEffectiveMarginRequirements(accountNumber: string, underlyingSymbol: string){
        //Get effective margin requirements for account
        const effectiveMarginRequirements = (await this.httpClient.getData(`/accounts/${accountNumber}/margin-requirements/${underlyingSymbol}/effective`, {}, {}))
        return extractResponseData(effectiveMarginRequirements)
    }
    async getPositionLimit(accountNumber: string){
        //Get the position limit
        const positionLimit = (await this.httpClient.getData(`/accounts/${accountNumber}/position-limit`, {}, {}))
        return extractResponseData(positionLimit)
    }
}
