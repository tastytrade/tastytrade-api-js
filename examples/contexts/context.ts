// src/context/state.ts
import { createContext } from 'react';
import TastytradeClient from "../../dist/tastytrade-api"
import { makeAutoObservable } from 'mobx';

class TastytradeContext {
    static Instance = new TastytradeContext('https://api.cert.tastyworks.com');
    public tastytradeApi: TastytradeClient
    public accountNumbers: string[] | null = null
    
    constructor(baseUrl: string) {
      makeAutoObservable(this)
      this.tastytradeApi = new TastytradeClient(baseUrl)
    }
}

const AppContext = createContext(TastytradeContext.Instance)
const tastytradeInstance = new TastytradeContext('https://api.cert.tastyworks.com');

export {AppContext,tastytradeInstance, TastytradeContext};
