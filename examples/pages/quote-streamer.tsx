import type { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import SubscribedSymbol from '../components/subscribed-symbol'
import _ from 'lodash'
import { AppContext } from '../contexts/context'
import Button from '../components/button'

const Home: NextPage = () => {
  const [symbols, setSymbols] = useState([] as string[])
  const [loading, setLoading] = useState(true)
  const [symbolText, setSymbolText] = useState('')

  const appContext = useContext(AppContext)

  useEffect(() => {
    appContext.tastytradeApi.accountsAndCustomersService.getQuoteStreamerTokens()
      .then(response => {
        const url = `${response['websocket-url']}/cometd`
        const quoteStreamer = appContext.setupQuoteStreamer(response.token, url)
        quoteStreamer.connect()
        setLoading(false)
      })

    return () => {
      if (!_.isNil(appContext.quoteStreamer)) {
        appContext.quoteStreamer.disconnect()
      }
    }
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
    <div>
      <h1 className="my-3 text-xl font-bold">
        DxFeed Quotes Demo
      </h1>
      <div className='my-1'>Type a symbol into the input and click 'Add Symbol'</div>

      <div>
        <input
          className="p-2 mb-4 w-full border border-gray-400"
          onChange={handleChange}
          required
        />
        <Button onClick={addSymbol} title='Add Symbol' />
      </div>

      {!loading && symbols.map(twSymbol => (
        <SubscribedSymbol key={twSymbol} symbol={twSymbol} onRemove={removeSymbol} />
      ))}
    </div>
  )
}

export default Home
