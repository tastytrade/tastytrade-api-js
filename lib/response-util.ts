import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function extractResponseData(httpResponse: any){
  if (_.has(httpResponse, 'data.data.items')) {
    return _.get(httpResponse, 'data.data.items')
  } else if (_.has(httpResponse, 'data.data')){
    return _.get(httpResponse, 'data.data')
  }else{
    return httpResponse
  }
}

// add login parser here
// create unit tests for login parser, extractreponsedata
