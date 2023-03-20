import TastytradeSession from '../models/tastytrade-session';
import { postData } from "./http-common";


export default class SessionService {
    authToken: string | null = null
    constructor(private session: TastytradeSession) {

    }
    async login(login: string, password: string){
        const response = await postData('/sessions', {login, password})
        this.session.authToken = response.data.data["session-token"]
        return response
    }
    async validate() {
        const response = await postData('/sessions/validate');
        return response.data;
      }
      
    async logout(){
        this.session.clear()
    }
}
