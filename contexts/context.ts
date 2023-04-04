// src/context/state.ts
import { createContext } from 'react';
import TastytradeClient from '../lib/service/tastytrade-api';

class TastytradeContext {
    static Instance = new TastytradeContext('https://api.cert.tastyworks.com');
    public tastytradeApi: TastytradeClient
    public account: string[] | null = null
    // public customer: Customer | null = null
    // public account: Account | null = null
    // public accountBalance: AccountBalance | null = null
    
    constructor(baseUrl: string) {
      this.tastytradeApi = new TastytradeClient(baseUrl)
    }

    async handleLogin(credentials: object) {
        try{
            await this.tastytradeApi.sessionService.login(credentials);
            const accountNum = await this.tastytradeApi.accountsAndCustomersService.getCustomerAccounts();
            const extractedAccountNumbers = accountNum.map(item => item.account['account-number']);

            if(extractedAccountNumbers.length){
                this.account = extractedAccountNumbers
            }
            //to-do:if 1 acct, get all pos
        }catch(error){
            console.log(error)
            return error
        }
    }

    async handleLogout(){
        if(this.account){
            try{
                await this.tastytradeApi.sessionService.logout()
                .then(this.account = null)
            }catch(error){
                return error
            }
        }
        else{
            console.log('not logged in')
            return "not logged in"
        }
    }

}

const AppContext = createContext(TastytradeContext.Instance)
const tastytradeInstance = new TastytradeContext('https://api.cert.tastyworks.com');

export {AppContext,tastytradeInstance, TastytradeContext};
