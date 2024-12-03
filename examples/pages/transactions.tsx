import React, {useContext} from 'react'
import { AppContext } from '../contexts/context';
import UseHttpRequest from '../components/use-http-request';
import _ from 'lodash'
import CustomTable from '../components/custom-table';

export default function Transactions() {
    const context = useContext(AppContext);

    const { isLoading, errorMessage, responseData } = UseHttpRequest(async () => (
        context.tastytradeApi.transactionsService.getAccountTransactions(context.accountNumbers![0])
      ), true)
    
    if (isLoading) {
      return <div>Loading...</div>
    }

    const transactions = responseData

    if (_.isNil(context.accountNumbers)) {
      return <p>Loading...</p>
    }

    if (_.isEmpty(transactions)) {
      return (
      <div>
        <h1>Transactions for {context.accountNumbers[0]}</h1>
        No Transactions
        </div>
      )
    }

    const renderTransactionRow = (transaction: any) => {
      return (
        <div>{transaction.description} ({transaction['transaction-sub-type']})</div>
      )
    }
    
    return (
      <div>
        <div className='text-lg font-bold mb-4'>Transactions for {context.accountNumbers[0]}</div>
        {errorMessage && <div>{errorMessage}</div>}
        <CustomTable rows={transactions} renderItem={renderTransactionRow}/>
      </div>
    )
}
