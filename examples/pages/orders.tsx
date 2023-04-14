import React, {useContext} from 'react'
import { AppContext } from '../contexts/context';
import UseHttpRequest from '../components/use-http-request';
import _ from 'lodash'
import CustomTable from '../components/custom-table';

export default function Orders() {
    const context = useContext(AppContext);

    const { isLoading, errorMessage, executeRequest, responseData } = UseHttpRequest(async () => (
        context.tastytradeApi.orderService.getLiveOrders(context.accountNumbers![0])
      ), true)
    
    if (isLoading) {
      return <div>Loading...</div>
    }

    const liveOrders = responseData

    if (_.isNil(context.accountNumbers)) {
      return <p>Loading...</p>
    }

    if (_.isEmpty(liveOrders)) {
      return (
        <div>
          <h1>Transactions for {context.accountNumbers[0]}</h1>
          No live Orders
          </div>
        )
      }
    
    return (
      <div>
        <h1>Live Orders for {context.accountNumbers[0]}</h1>
          {errorMessage && <div>{errorMessage}</div>}
          <CustomTable tableInformation={liveOrders}/>
      </div>
    );
};
