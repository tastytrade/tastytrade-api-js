import _ from 'lodash'

export default function extractResponseData(httpResponse: any){
  if (_.has(httpResponse, 'data.data.items')) {
    return _.get(httpResponse, 'data.data.items')
  } else {
    return _.get(httpResponse, 'data.data')
  }
}