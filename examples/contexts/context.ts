// src/context/state.ts
import { createContext } from 'react';
import TastytradeClient from 'tastytrade-api'
// import TastytradeClient from '../../lib/tastytrade-api';

class TastytradeContext {
    static Instance = new TastytradeContext('https://api.cert.tastyworks.com');
    public tastytradeApi: TastytradeClient
    public accountNumbers: string[] | null = null
    
    constructor(baseUrl: string) {
      this.tastytradeApi = new TastytradeClient(baseUrl)
    }
}

const AppContext = createContext(TastytradeContext.Instance)
const tastytradeInstance = new TastytradeContext('https://api.cert.tastyworks.com');

export {AppContext,tastytradeInstance, TastytradeContext};
