// src/context/state.ts
import { createContext } from 'react';
import TastytradeClient, { MarketDataStreamer } from "tastytrade-api"
import { makeAutoObservable } from 'mobx';
import _ from 'lodash'

class TastytradeContext {
    static Instance = new TastytradeContext('https://api.cert.tastyworks.com', 'wss://streamer.cert.tastyworks.com');
    public tastytradeApi: TastytradeClient
    public accountNumbers: string[] = []
    public readonly marketDataStreamer: MarketDataStreamer = new MarketDataStreamer()
    
    constructor(baseUrl: string, accountStreamerUrl: string) {
      makeAutoObservable(this)
      this.tastytradeApi = new TastytradeClient(baseUrl, accountStreamerUrl)
      makeAutoObservable(this.tastytradeApi.session)
    }

    get isLoggedIn() {
      return this.tastytradeApi.session.isValid
    }
}

const AppContext = createContext(TastytradeContext.Instance)

export { AppContext, TastytradeContext };
