import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { streamer } from '../lib/quote-streamer'
import { useEffect, useState } from 'react'
import SubscribedSymbol from '../components/subscribed-symbol'
import _ from 'lodash'

const twSymbols = [
  'AAPL',
  'SPY 220617C00438000'
]

const Home: NextPage = () => {
  const [symbols, setSymbols] = useState(twSymbols)
  const [loading, setLoading] = useState(true)
  const [symbolText, setSymbolText] = useState('')

  useEffect(() => {
    streamer.connect()
    setLoading(false)
    return () => streamer.disconnect()
  }, []);

  const addSymbol = () => {
    const symbol = symbolText.trim().toUpperCase()
    if (symbols.includes(symbol)) {
      return
    }

    setSymbols([...symbols, symbol])
  }

  const removeSymbol = (symbol: string) => {
    setSymbols(_.without(symbols, symbol))
  }

  const handleChange = (event: any) => {
    setSymbolText(event.target.value);
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          DxFeed Quotes Demo
        </h1>

        <div>
          <input type="text" onChange={handleChange} />
          <button onClick={addSymbol}>Add Symbol</button>
        </div>

        {!loading && symbols.map(twSymbol => (
          <SubscribedSymbol key={twSymbol} symbol={twSymbol} onRemove={removeSymbol} />
        ))}
      </main>
    </div>
  )
}

export default Home
