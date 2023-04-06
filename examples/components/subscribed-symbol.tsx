import styles from '../styles/SubscribedSymbol.module.css'
// import { streamer } from '../../lib/quote-streamer'
import { useEffect, useState } from 'react'
import _ from 'lodash'

export default function SubscribedSymbol(props: any) {
  const [bidPrice, setBidPrice] = useState(NaN)
  const [askPrice, setAskPrice] = useState(NaN)

  const handleEvent = (event: any) => {
    setBidPrice(event.bidPrice)
    setAskPrice(event.askPrice)
  }

  useEffect(() => {
    // const unsubscribe = streamer.subscribe(props.symbol, handleEvent)
    // return unsubscribe
  }, []);

  return (
    <div className={styles.main}>
      <div>{props.symbol}</div>
      <div className={styles.rightColumn}>
        <div>Bid: {bidPrice}</div>
        <div>Ask: {askPrice}</div>
        <button onClick={() => props.onRemove(props.symbol)}>Remove</button>
      </div>
    </div>
  )
}
