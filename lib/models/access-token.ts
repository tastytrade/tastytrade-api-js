import _ from 'lodash'

export default class AccessToken {
    public token: string = ''
    public expiresIn: number = 0

    get isExpired(): boolean {
        return this.isEmpty || Date.now() >= this.expiration.getTime();
    }

    get isValid(): boolean {
        return !_.isNil(this.token) && !this.isExpired;
    }

    get isEmpty(): boolean {
        return _.isNil(this.token) || this.token.length === 0;
    }

    get expiration() {
        // Set expiration a bit earlier to account for clock skew
        return new Date(Date.now() + ((this.expiresIn - 30) * 1000));
    }

    public updateFromTokenResponse(tokenResponse: any): void {
      this.token = _.get(tokenResponse, "data.access_token");
      this.expiresIn = _.get(tokenResponse, "data.expires_in");
    }

    get authorizationHeader(): string | null {
        if (this.isValid) {
            return `Bearer ${this.token}`;
        }
        return null;
    }

    clear() {
        this.token = ''
        this.expiresIn = 0
    }
}
