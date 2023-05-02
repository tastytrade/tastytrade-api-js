import extractResponseData from "../utils/response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class MarginRequirementsService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Margin-requirements: Allows a client to fetch margin-requirements for positions and orders
    async getMarginRequirements(accountNumber: string){
        //Fetch current margin/captial requirements report for an account
        const marginRequirements = (await this.httpClient.getData(`/margin/accounts/${accountNumber}/requirements`))
        return extractResponseData(marginRequirements)
    }
    async postMarginRequirements(accountNumber: string, order: object){
        //Estimate margin requirements for an order given an account
        const marginRequirements = (await this.httpClient.postData(`/margin/accounts/${accountNumber}/dry-run`, order, {}))
        return extractResponseData(marginRequirements)
    }
}
