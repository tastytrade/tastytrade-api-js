import { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { AppContext } from '../contexts/context'
import { MarketDataSubscriptionType } from "tastytrade-api"

export default function SubscribedSymbol(props: any) {
  const [bidPrice, setBidPrice] = useState(NaN)
  const [askPrice, setAskPrice] = useState(NaN)

  const appContext = useContext(AppContext)

  useEffect(() => {
    const removeListener = appContext.marketDataStreamer.addDataListener((event: any) => {
      const eventData = _.find(event.data, data =>
        data.eventType === MarketDataSubscriptionType.Quote &&
        data.eventSymbol === props.symbol
      )

      if (!_.isNil(eventData)) {
        setBidPrice(eventData.bidPrice)
        setAskPrice(eventData.askPrice)
      }
    })

    appContext.marketDataStreamer.addSubscription(props.symbol)
    return () => {
      appContext.marketDataStreamer.removeSubscription(props.symbol)
      removeListener()
    }
  }, []);

  return (
    <div className='my-2'>
      <div className='font-bold'>{props.symbol}</div>
      <div className='flex-row'>
        <div>Bid: {bidPrice}</div>
        <div>Ask: {askPrice}</div>
      </div>
      <button className='rounded cursor-pointer p-1 px-2 bg-black text-white' onClick={() => props.onRemove(props.symbol)}>
        Remove {props.symbol}
      </button>
    </div>
  )
}
