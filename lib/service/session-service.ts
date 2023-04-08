import extractResponseData from "../response-util";
import TastytradeHttpClient from "./tastytrade-http-client";

export default class SessionService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Sessions: Allows an API client to interact with their session, or create a new one.
    async login(usernameOrEmail: string, password: string, rememberMe: boolean = false) {
        //Create a new user session.
        const params = { login: usernameOrEmail, password, 'remember-me': rememberMe }
        const sessionResponse = await this.httpClient.postData('/sessions', params, {})
        const sessionData = extractResponseData(sessionResponse)
        this.httpClient.session.authToken = sessionData["session-token"]
        return sessionData
    }

    async loginWithRememberToken(username: string, rememberToken: string, rememberMe: boolean = false){
      //Creates a session using the remember token.
      const params = { username, 'remember-token': rememberToken, 'remember-me': rememberMe }
      const sessionData = extractResponseData(await this.httpClient.postData('/sessions', params, {}))
      this.httpClient.session.authToken = sessionData["session-token"]
      return sessionData
    }

    async validate() {
        const response = await this.httpClient.postData('/sessions/validate', {}, {});
        return extractResponseData(response);
    }
    async logout(){
        this.httpClient.session.clear()
    }
}
