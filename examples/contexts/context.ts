// src/context/state.ts
import { createContext } from 'react';
import TastytradeClient, { ClientConfig, LogLevel } from 'tastytrade-api'
import { makeAutoObservable } from 'mobx';
import _ from 'lodash'

const SANDBOX_BASE_URL = 'https://api.cert.tastyworks.com'
const SANDBOX_STREAMER_URL = 'wss://streamer.cert.tastyworks.com'

class TastytradeContext {
    public tastytradeApi: TastytradeClient
    public accountNumbers: string[] = []
    
    constructor(baseUrl: string, accountStreamerUrl: string) {
      makeAutoObservable(this)
      const config = {
        ...TastytradeClient.ProdConfig,
        clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.NEXT_PUBLIC_OAUTH_REFRESH_TOKEN,
        oauthScopes: ['read']
      } as ClientConfig
      this.tastytradeApi = new TastytradeClient(config)
    }
}

const AppContext = createContext<TastytradeContext>(new TastytradeContext(SANDBOX_BASE_URL, SANDBOX_STREAMER_URL))

export { AppContext, TastytradeContext };
