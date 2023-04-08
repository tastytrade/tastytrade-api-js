import _ from 'lodash'

export default class TastytradeSession { 
    authToken: string | null = null

    get isValid() {
      return !_.isNil(this.authToken)
    }

    clear() {
        this.authToken = null
    }
}
