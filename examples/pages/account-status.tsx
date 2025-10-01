import React, {useContext} from 'react'
import { AppContext } from '../contexts/context';
import UseHttpRequest from '../components/use-http-request';
import _ from "lodash"
import { ObjectPropertiesTable } from '../components/custom-table';

export default function AccountStatus() {
  const context = useContext(AppContext);

  const { isLoading, errorMessage, responseData } = UseHttpRequest(async () => (
    context.tastytradeApi.accountStatusService.getAccountStatus(context.accountNumbers![0])
  ), true)

  if (isLoading) {
    return <div>Loading...</div>
  }
  const accountStatus = responseData

  if (_.isNil(context.accountNumbers)) {
    return <p>Loading...</p>
  }

  if (_.isEmpty(accountStatus)) {
    return (
      <div>
        <h1>Transactions for {context.accountNumbers[0]}</h1>
        No Account Status
        </div>
      )
    }
  
  return (
  <div>
      <div className='text-lg font-bold mb-4'>Account Statuses for {context.accountNumbers![0]}</div>
      {errorMessage && <div>{errorMessage}</div>}
      <ObjectPropertiesTable item={accountStatus}/>
  </div>
  )
}
