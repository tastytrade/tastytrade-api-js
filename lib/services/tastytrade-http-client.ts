import TastytradeSession from "../models/tastytrade-session.js"
import AccessToken from "../models/access-token.js"
import axios from "axios"
import qs from 'qs'
import { recursiveDasherizeKeys } from "../utils/json-util.js"
import _ from 'lodash'
import type Logger from "../logger.js"
import extractResponseData from "../utils/response-util.js";
import type { ClientConfig } from "../tastytrade-api.js"

const ParamsSerializer = {
  serialize: function (queryParams: object) {
    return qs.stringify(queryParams, { arrayFormat: 'brackets' })
  }
}

const ApiVersionRegex = /^\d{8}$/

export default class TastytradeHttpClient {
    private readonly logger?: Logger
    public baseUrl: string
    public clientSecret?: string
    public refreshToken?: string
    public oauthScopes?: string[]
    public readonly accessToken: AccessToken
    public readonly session: TastytradeSession
    private _targetApiVersion?: string

    constructor(clientConfig: Partial<ClientConfig>, logger?: Logger) {
      this.logger = logger
      this.baseUrl = clientConfig.baseUrl!
      this.accessToken = new AccessToken()
      this.session = new TastytradeSession()
      this.updateConfig(clientConfig)
    }

    public updateConfig(config: Partial<ClientConfig>) {
      const httpClientConfig = _.pick(config, ['clientSecret', 'refreshToken', 'oauthScopes', 'targetApiVersion'])
      if (!_.isEmpty(httpClientConfig)) {
        Object.assign(this, httpClientConfig)
        this.accessToken.clear()
      }
    }

    get needsTokenRefresh(): boolean {
      if (this.session.isValid) {
        return false
      }
      if (_.isNil(this.refreshToken) || _.isNil(this.clientSecret)) {
        return false
      }
      return this.accessToken.isExpired
    }

    get authHeader(): string | null {
      if (this.session.isValid) {
        return this.session.authToken
      }
      if (this.accessToken.isValid) {
        return this.accessToken.authorizationHeader
      }
      return null
    }

    private getDefaultHeaders(): any {
      const headers: { [key: string]: any } = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": this.authHeader
      };

      if (!_.isNil(this.targetApiVersion)) {
        headers["Accept-Version"] = this.targetApiVersion
      }

      // Only set user agent if running in node
      if (typeof window === 'undefined') {
        headers["User-Agent"] = 'tastytrade-sdk-js'
      }

      return headers
    }

    private axiosConfig(method: string, url: string, data: object = {}, headers: object = {}, params: object = {}): any {
      return _.omitBy(
        { method, url, baseURL: this.baseUrl, data, headers, params, paramsSerializer: ParamsSerializer},
        _.isEmpty
      )
    }

    public async generateAccessToken(): Promise<any> {
      if (_.isNil(this.refreshToken) || _.isNil(this.clientSecret) || _.isNil(this.oauthScopes)) {
        throw new Error('Missing required parameters to generate access token (refreshToken, clientSecret, oauthScopes)')
      }
      const params = { 
        refresh_token: this.refreshToken,
        client_secret: this.clientSecret,
        scope: this.oauthScopes!.join(' '),
        grant_type: 'refresh_token'
      }

      const config = this.axiosConfig('post', '/oauth/token', params)
      this.logger?.info('Making request', config)
      const tokenResponse = await axios.request(config)
      this.accessToken.updateFromTokenResponse(tokenResponse)
      return this.accessToken
    }

    private async executeRequest(method: string, url: string, data: object = {}, headers: object = {}, params: object = {}): Promise<any> {
      if (this.needsTokenRefresh) {
        await this.generateAccessToken()
      }
      let dasherizedParams = params
      let dasherizedData = data
      dasherizedParams = recursiveDasherizeKeys(params)
      dasherizedData = recursiveDasherizeKeys(data)

      const mergedHeaders = { ...headers, ...this.getDefaultHeaders() }

      const config = this.axiosConfig(method, url, dasherizedData, mergedHeaders, dasherizedParams)
      this.logger?.info('Making request', config)
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

    public get targetApiVersion(): string | undefined {
      return this._targetApiVersion
    }

    public set targetApiVersion(version: string | undefined) {
      if (!_.isNil(version) && !ApiVersionRegex.test(version)) {
        throw new Error('Invalid API version format. Expected YYYYMMDD.')
      }
      this._targetApiVersion = version
    }
}
