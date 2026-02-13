import React, { useContext } from 'react'
import { AppContext } from '../contexts/context';
import { observer } from 'mobx-react-lite'
import UseHttpRequest from '../components/use-http-request'
import _ from 'lodash'
import { ObjectPropertiesTable } from '../components/custom-table'

const Index = observer(() =>{
  const context = useContext(AppContext);

  const { isLoading, errorMessage, responseData } = UseHttpRequest(async () => {
    const accounts = await context.tastytradeApi.accountsAndCustomersService.getCustomerAccounts();
    const extractedAccountNumbers = accounts.map((item: any) => item.account['account-number']);

    if(extractedAccountNumbers.length){
      context.accountNumbers = extractedAccountNumbers
    }

    const balances = await context.tastytradeApi.balancesAndPositionsService.getAccountBalanceValues(context.accountNumbers![0])
    console.log(balances)
    return balances
  }, true)

  if (isLoading) {
    return <div>Loading...</div>
  }

  const balances = responseData

  if (_.isNil(context.accountNumbers)) {
    return <p>Loading...</p>
  }

  if (_.isEmpty(balances)) {
    return (
      <div>
        <h1>Transactions for {context.accountNumbers[0]}</h1>
        No Balances
      </div>
    )
  }

  return (
    <div>
      <div className='text-lg font-bold mb-4'>Balances for {context.accountNumbers[0]}</div>
      {errorMessage && <div>{errorMessage}</div>}
      <ObjectPropertiesTable item={balances}/>
    </div>
  )
});

export default Index
