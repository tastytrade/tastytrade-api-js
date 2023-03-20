import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { accountStreamer, STREAMER_STATE } from '../account-streamer/account-streamer'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import toast from 'react-hot-toast'


function interpretStreamerState(state: STREAMER_STATE) {
  switch (state) {
    case STREAMER_STATE.Open:
      return 'Open'
    case STREAMER_STATE.Closed:
      return 'Closed'
    case STREAMER_STATE.Error:
      return 'Error'
    default:
      return 'Unknown'
  }
}

const AccountStreamer: NextPage = () => {
  const [streamerState, setStreamerState] = useState(STREAMER_STATE.Closed)
  const [authToken, setAuthToken] = useState('')
  const [accountNumber, setAccountNumber] = useState('')


  useEffect(() => {
    setStreamerState(accountStreamer.streamerState)
    const streamerStateDisposer = accountStreamer.addStreamerStateObserver((accountStreamerState) => {
      if (accountStreamerState === STREAMER_STATE.Closed) {
        toast.error('Account streamer has been closed.')
      }
      setStreamerState(accountStreamerState)
    })
    const streamerMessageDisposer = accountStreamer.addMessageObserver((type, action, status) => {
      if (!_.isNil(type)) {
        toast.success(`Received ${type} message`)
      } else {
        toast(`Received message with action: ${action}, status: ${status}`)
      }
    })
    return () => {
      accountStreamer.stop()
      streamerMessageDisposer()
      streamerStateDisposer()
    }
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

  const _renderSubscribe = () => {
    const disabled = streamerState !== STREAMER_STATE.Open

    return (
      <div className={styles.inputSection}>
        <div>
          <label htmlFor="sessionTokenInput">Account Number: </label>
          <input type="text" onChange={handleAccountNumberChange} />
        </div>
        <button disabled={disabled} onClick={doSubscribeAccount}>Subscribe Account Number</button>
        {disabled && <div>Unable to subscribe. Streamer is not open.</div>}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Tastyworks Account Websocket Demo
        </h1>
        <h3>Websocket state is: {interpretStreamerState(streamerState)}</h3>
        <ol>
          <li>Login through the api (POST /sessions) to get a session token.</li>
          <li>Enter the session token&apos;s value into the first input and start the streamer.</li>
          <li>Once the websocket is opened, you can input your account number to subscribe to account-related messages (order status updates, balance updates, etc).</li>
          <li>While subscribed, you can place trades in the account and receive update messages here.</li>
          <li>Websocket messages will be logged to the console.</li>
        </ol>

        <div className={styles.inputSection}>
          <div>
            <label htmlFor="sessionTokenInput">Session Token: </label>
            <input id="sessionTokenInput" type="text" onChange={handleAuthTokenChange} />
          </div>
          <button onClick={doSubscribe}>Start Heartbeat</button>
          {_renderSubscribe()}
        </div>
      </main>
    </div>
  )
}

export default AccountStreamer
