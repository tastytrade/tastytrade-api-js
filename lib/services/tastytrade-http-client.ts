import TastytradeSession from "../models/tastytrade-session"
import axios from "axios"
import qs from 'qs'
import { recursiveDasherizeKeys } from "../utils/json-util"
import _ from 'lodash'
import https from 'https'
import { MinTlsVersion } from "../utils/constants"

const ParamsSerializer = {
  serialize: function (queryParams: object) {
    return qs.stringify(queryParams, { arrayFormat: 'brackets' })
  }
}

export default class TastytradeHttpClient{
    public readonly session: TastytradeSession
    private readonly httpsAgent: https.Agent

    constructor(private readonly baseUrl: string) {
      this.session = new TastytradeSession()
      this.httpsAgent = new https.Agent({ minVersion: MinTlsVersion })
    }

    private getDefaultHeaders(): any {
        return {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": this.session.authToken,
        };
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
        paramsSerializer: ParamsSerializer,
        httpsAgent: this.httpsAgent
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
