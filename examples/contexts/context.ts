// src/context/state.ts
import { createContext } from 'react';
import TastytradeClient, { LogLevel } from "tastytrade-api"
import { makeAutoObservable } from 'mobx';
import _ from 'lodash'

const SANDBOX_BASE_URL = 'https://api.cert.tastyworks.com'
const SANDBOX_STREAMER_URL = 'wss://streamer.cert.tastyworks.com'

class TastytradeContext {
    public tastytradeApi: TastytradeClient
    public accountNumbers: string[] = []
    
    constructor(baseUrl: string, accountStreamerUrl: string) {
      makeAutoObservable(this)
      this.tastytradeApi = new TastytradeClient({ baseUrl, accountStreamerUrl, logger: console, logLevel: LogLevel.INFO })
      makeAutoObservable(this.tastytradeApi.session)
    }

    get isLoggedIn() {
      return this.tastytradeApi.session.isValid
    }
}

const AppContext = createContext<TastytradeContext>(new TastytradeContext(SANDBOX_BASE_URL, SANDBOX_STREAMER_URL))

export { AppContext, TastytradeContext };
