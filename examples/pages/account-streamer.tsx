import type { NextPage } from 'next'
import { STREAMER_STATE } from 'tastytrade-api'
import { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import toast from 'react-hot-toast'
import { AppContext } from '../contexts/context'
import Button from '../components/button'

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

const AccountStreamerPage: NextPage = () => {
  const context = useContext(AppContext);
  const accountStreamer = context.tastytradeApi.accountStreamer
  const [streamerState, setStreamerState] = useState(STREAMER_STATE.Closed)

  useEffect(() => {
    setStreamerState(accountStreamer.streamerState)
    const streamerStateDisposer = accountStreamer.addStreamerStateObserver((accountStreamerState) => {
      switch (accountStreamerState) {
        case STREAMER_STATE.Closed:
          toast.error('Account streamer has been closed.')
          break
        case STREAMER_STATE.Open:
          toast.success('Account streamer has been opened.')
          break
        case STREAMER_STATE.Error:
          toast.error('Account streamer experienced an error.')
          break
      }

      setStreamerState(accountStreamer.streamerState)
    })

    const streamerMessageDisposer = accountStreamer.addMessageObserver((json: object) => {
      toast.success(`Received message: ${json}`)
    })

    return () => {
      accountStreamer.stop()
      streamerMessageDisposer()
      streamerStateDisposer()
    }
  }, []);

  const startStreamer = () => {
    context.tastytradeApi.accountStreamer.start()
  }

  const stopStreamer = () => {
    context.tastytradeApi.accountStreamer.stop()
  }

  const subscribeToAccounts = () => {
    accountStreamer.subscribeToAccounts(context.accountNumbers)
  }

  const _renderStartStop = () => {
    const streamerAction = streamerState === STREAMER_STATE.Open ? stopStreamer : startStreamer
    const buttonText = streamerState === STREAMER_STATE.Open ? 'Close' : 'Open'
    return (
      <div className="my-3">
        <Button onClick={streamerAction} title={`${buttonText} Connection`} />
      </div>
    )
  }

  const _renderSubscribe = () => {
    const disabled = streamerState !== STREAMER_STATE.Open

    return (
      <div>
        <Button disabled={disabled} onClick={subscribeToAccounts} title="Subscribe To Account Messages" />
        {disabled && <div>Unable to subscribe. Streamer is not open.</div>}
      </div>
    )
  }

  return (
    <div className="">
      <main className="">
        <h1 className="my-2 text-xl font-bold">
          Tastytrade Account Websocket Demo
        </h1>
        <h3 className='my-2 text-lg font-bold'>Websocket state is: {interpretStreamerState(streamerState)}</h3>
        <div>To begin, you must open a connection to the account streamer service. Once opened, the websocket will begin sending/receiving heartbeat messages.</div>
        <div>Once the connection is open, you may send a subscribe message to receive notifications for your account(s).</div>
        <div>While the connection is open, you can place trades in the account(s) and receive update messages here.</div>
        <div className='mb-2'>All messages will be logged to the console.</div>
        {_renderStartStop()}
        <div className='my-5'>
          <div>Your account numbers:</div>
          {context.accountNumbers!.map((accountNumber) => (
            <div key={accountNumber}>{accountNumber}</div>
          ))}
        </div>
        {_renderSubscribe()}
      </main>
    </div>
  )
}

export default AccountStreamerPage
