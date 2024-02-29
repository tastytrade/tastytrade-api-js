import TastytradeSession from "../models/tastytrade-session.js"
import axios from "axios"
import qs from 'qs'
import { recursiveDasherizeKeys } from "../utils/json-util.js"
import _ from 'lodash'

const ParamsSerializer = {
  serialize: function (queryParams: object) {
    return qs.stringify(queryParams, { arrayFormat: 'brackets' })
  }
}

export default class TastytradeHttpClient{
    public readonly session: TastytradeSession

    constructor(private readonly baseUrl: string) {
      this.session = new TastytradeSession()
    }

    private getDefaultHeaders(): any {
      const headers: { [key: string]: any } = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": this.session.authToken
      };

      // Only set user agent if running in node
      if (typeof window === 'undefined') {
        headers["User-Agent"] = 'tastytrade-sdk-js'
      }

      return headers
    }

    private async executeRequest(method: string, url: string, data: object = {}, headers: object = {}, params: object = {}) {
      const dasherizedParams = recursiveDasherizeKeys(params)
      const dasherizedData = recursiveDasherizeKeys(data)
      const mergedHeaders = { ...headers, ...this.getDefaultHeaders() }

      const config = _.omitBy({
        method,
        url,
        baseURL: this.baseUrl,
        data: dasherizedData,
        headers: mergedHeaders, 
        params: dasherizedParams,
        paramsSerializer: ParamsSerializer
       }, _.isEmpty)

      return axios.request(config)
    }

    async getData(url: string, headers: object = {}, queryParams: object = {}): Promise<any> {
        return this.executeRequest('get', url, {}, headers, queryParams);
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
