import TastytradeSession from '../models/tastytrade-session';
import { postData } from "./http-common";


export default class SessionService {
    authToken: string | null = null
    constructor(private session: TastytradeSession) {

    }
    async login(login: string, password: string){
        this.session.authToken = (await postData('/sessions', {login, password}, {})).data.data["session-token"]
    }
    async validate() {
        const response = await postData('/sessions/validate', {}, { Authorization: this.session.authToken });
        return response.data;
      }
      
    async logout(){
        this.session.clear()
    }
}
