import TastytradeSession from "../models/tastytrade-session"
import axios from "axios";

export default class TastytradeHttpClient{
    public readonly session: TastytradeSession

    constructor(private readonly baseUrl: string) {
      this.session = new TastytradeSession()
    }
    private getDefaultHeaders(): any {
        return {
          "Content-type": "application/json",
          "Accept": "application/json",
          "Authorization": this.session.authToken,
        };
    }
    private async executeRequest(method: string, url: string, data: object = {}, headers: object = {}, params: object = {}) {
        return axios.request({
            method,
            url,
            baseURL: this.baseUrl,
            data,
            headers: { ...headers, ...this.getDefaultHeaders() }, 
            params
        })
    }
    async getData(url: string, headers: object = {}, queryParams: object = {}): Promise<any> {
        return this.executeRequest('get', url, headers, queryParams);
    }
    async postData(url: string, data: object, headers: object): Promise<any> {
        return this.executeRequest('post', url, data, headers);
    }
    async putData(url: string, data: object, headers: object): Promise<any> {
        return this.executeRequest('put', url, data, headers);
    }
    async patchData(url: string, data: object, headers: object): Promise<any> {
        return this.executeRequest('patch', url, data, headers);
    }
    async deleteData(url: string, headers: object): Promise<any> {
        return this.executeRequest('delete', url, headers);
    }
}
