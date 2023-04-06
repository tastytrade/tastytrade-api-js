import '../styles/globals.css'
import Layout from '../components/layout'
import type { AppProps } from 'next/app'
import {AppContext, TastytradeContext} from '../contexts/context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <AppContext.Provider value = {TastytradeContext.Instance}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
  )
}

export default MyApp
