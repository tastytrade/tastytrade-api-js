import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { accountStreamer } from '../account-streamer/account-streamer'
import { useEffect, useState } from 'react'
import SubscribedSymbol from '../components/subscribed-symbol'
import _ from 'lodash'

const AccountStreamer: NextPage = () => {
  const [authToken, setAuthToken] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  useEffect(() => {
    return () => accountStreamer.stop()
  }, []);

  const handleAuthTokenChange = (event: any) => {
    setAuthToken(event.target.value.trim());
  }

  const handleAccountNumberChange = (event: any) => {
    setAccountNumber(event.target.value.trim())
  }

  const doSubscribe = () => {
    accountStreamer.start(authToken)
  }

  const doSubscribeAccount = () => {
    accountStreamer.subscribeToAccounts([accountNumber])
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          DxFeed Quotes Demo
        </h1>

        <div>
          <input type="text" onChange={handleAuthTokenChange} />
          <button onClick={doSubscribe}>Start Heartbeat</button>
          <input type="text" onChange={handleAccountNumberChange} />
          <button onClick={doSubscribeAccount}>Subscribe Account Number</button>
        </div>
      </main>
    </div>
  )
}

export default AccountStreamer
