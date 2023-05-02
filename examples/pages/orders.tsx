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

    const renderEmpty = () => {
      return <div>No live Orders</div>
    }

    const renderOrderRow = (order: any) => {
      return (
        <div>
          <div>{order.price} {order['price-effect']}</div>
          {order.legs.map((leg: any) => {
            <div>{leg.action} {leg.symbol}</div>
          })}
        </div>
      )
    }

    const renderOrders = () => {
      if (_.isEmpty(liveOrders)) {
        return renderEmpty()
      }

      <CustomTable rows={liveOrders} renderItem={renderOrderRow}/>
    }
    
    return (
      <div>
        <div className='text-lg font-bold mb-4'>Live Orders for {context.accountNumbers[0]}</div>
        {errorMessage && <div>{errorMessage}</div>}
        {renderOrders()}
      </div>
    );
};
