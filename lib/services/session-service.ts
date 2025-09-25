import extractResponseData from "../utils/response-util.js";
import TastytradeHttpClient from "./tastytrade-http-client.js";

export default class SessionService {
    constructor(public httpClient: TastytradeHttpClient) {
    }

    private get clientId(): string {
        return '9953f07a-5de4-408c-a8ab-688a6320f00f'
    }

    private get clientSecret(): string {
        return 'baa245033420a05d013541c0c6ef4f98bb16a1ec'
    }

    private get refreshToken(): string {
        return 'eyJhbGciOiJFZERTQSIsInR5cCI6InJ0K2p3dCIsImtpZCI6IkZqVTdUT25qVEQ2WnVySlg2cVlwWmVPbzBDQzQ5TnIzR1pUN1E4MTc0cUkiLCJqa3UiOiJodHRwczovL2ludGVyaW9yLWFwaS5hcjIudGFzdHl0cmFkZS5zeXN0ZW1zL29hdXRoL2p3a3MifQ.eyJpc3MiOiJodHRwczovL2FwaS50YXN0eXRyYWRlLmNvbSIsInN1YiI6IlUwMDAwMDM3MTg0IiwiaWF0IjoxNzU4MjQzNjY0LCJhdWQiOiI5OTUzZjA3YS01ZGU0LTQwOGMtYThhYi02ODhhNjMyMGYwMGYiLCJncmFudF9pZCI6Ikc0ZTc4MjFkYy03NTQyLTQ0NTQtODBkMy1iYjU3NGEwMGRkYWMiLCJzY29wZSI6InJlYWQgdHJhZGUifQ.ZsP51rUGQIXsP-cU0OCa-45AwwMp18YxOrT_mrrocClhRL7bfWctX8GOJ35Nn_E48WOuQPxUF3KMhSn1tkqLBQ'
    }

    // Sessions: Allows an API client to interact with their session, or create a new one.
    async login(usernameOrEmail: string, password: string, rememberMe = false) {
        // Create a new user session.
        const params = { login: usernameOrEmail, password, rememberMe }
        const sessionResponse = await this.httpClient.postData('/sessions', params, {})
        const sessionData = extractResponseData(sessionResponse)
        this.httpClient.session.authToken = sessionData["session-token"]
        return sessionData
    }

    async loginWithRememberToken(usernameOrEmail: string, rememberToken: string, rememberMe = false){
      // Creates a session using the remember token.
      const params = { login: usernameOrEmail, rememberToken, rememberMe }
      const sessionData = extractResponseData(await this.httpClient.postData('/sessions', params, {}))
      this.httpClient.session.authToken = sessionData["session-token"]
      return sessionData
    }

    async validate() {
        const response = await this.httpClient.postData('/sessions/validate', {}, {});
        return extractResponseData(response);
    }
    async logout(){
        const response = await this.httpClient.deleteData('/sessions', {});// added this for the integration tests?
        this.httpClient.session.clear()
        return extractResponseData(response);
    }
}
