import { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { AppContext } from '../contexts/context'
import Button from './button'
import { EventType } from '@dxfeed/api'

export default function SubscribedSymbol(props: any) {
  const [bidPrice, setBidPrice] = useState(NaN)
  const [askPrice, setAskPrice] = useState(NaN)

  const appContext = useContext(AppContext)

  const handleEvent = (event: any) => {
    console.log(event)
    if (event.eventType === EventType.Quote) {
      setBidPrice(event.bidPrice)
      setAskPrice(event.askPrice)
    }
  }

  useEffect(() => {
    const unsubscribe = appContext.quoteStreamer!.subscribe(props.symbol, handleEvent)
    return unsubscribe
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
