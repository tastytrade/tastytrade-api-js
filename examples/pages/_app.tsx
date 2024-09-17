import '../styles/globals.css'
import Layout from '../components/layout'
import type { AppProps } from 'next/app'
import {AppContext, TastytradeContext} from '../contexts/context'
import { useMemo } from 'react'

function MyApp({ Component, pageProps }: AppProps) {

  const context = useMemo(
    () => new TastytradeContext('https://api.cert.tastyworks.com', 'wss://streamer.cert.tastyworks.com'),
    []
  );
  return (
      <AppContext.Provider value = {context}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
  )
}

export default MyApp
