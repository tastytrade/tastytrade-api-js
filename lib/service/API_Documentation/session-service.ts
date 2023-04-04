import TastytradeHttpClient from "../tastytrade-http-client";

export default class SessionService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Sessions: Allows an API client to interact with their session, or create a new one.
    async login(credentials: object = {}) {
        //Create a new user session.
        this.httpClient.session.authToken = (await this.httpClient.postData('/sessions', credentials, {})).data.data["session-token"]
    }
    async validate() {
        const response = await this.httpClient.postData('/sessions/validate', {}, {});
        return response.data;
    }
    async logout(){
        this.httpClient.session.clear()
    }
}
