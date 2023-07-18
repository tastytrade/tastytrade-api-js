# Tastytrade Api Javascript SDK

## Installation
npm:
`npm -i @tastytrade/api`

yarn:
`yarn add @tastytrade/api`

## Quickstart
```js
import TastytradeClient from "@tastytrade/api"
const tastytradeClient = new TastytradeClient(baseUrl, accountStreamerUrl)
const loginResponse = await tastytradeClient.sessionService.login(usernameOrEmail, pasword)
const accounts = await tastytradeClient.accountsAndCustomersService.getCustomerAccounts()
const accountPositions = await tastytradeClient.balancesAndPositionsService.getPositionsList(accounts[0].accounts['account-number'])
```

### Market Data
```js
import TastytradeClient, { MarketDataStreamer, MarketDataSubscriptionType } from "@tastytrade-api"
const tastytradeClient = new TastytradeClient(baseUrl, accountStreamerUrl)
await tastytradeClient.sessionService.login(usernameOrEmail, pasword)
const tokenResponse = await tastytradeClient.AccountsAndCustomersService.getApiQuoteToken()
const streamer = new MarketDataStreamer()
streamer.connect(tokenResponse['dxlink-url'], tokenResponse.token)

function handleMarketDataReceived(data) {
  // Triggers every time market data event occurs
  console.log(data)
}

// Add a listener for incoming market data. Returns a remove() function that removes the listener from the quote streamer
const removeDataListener = streamer.addDataListener(handleMarketDataReceived)

// Subscribe to a single equity quote
streamer.addSubscription('AAPL')
// Optionally specify which market data events you want to subscribe to
streamer.addSubscription('SPY', { subscriptionTypes: [MarketDataSubscriptionType.Quote] })

// Subscribe to a single equity option quote
const optionChain = await tastytradeClient.instrumentsService.getOptionChain('AAPL')
streamer.addSubscription(optionChain[0]['streamer-symbol'])
```

### Account Streamer
```js
const TastytradeApi = require("@tastytrade/api")
const TastytradeClient = TastytradeApi.default
const { AccountStreamer } = TastytradeApi
const _ = require('lodash')

function handleStreamerMessage(json) {
  console.log('streamer message received: ', json)
}

function handleStreamerStateChange(streamerState) {
  console.log('streamer state changed: ', streamerState)
}

const tastytradeClient = new TastytradeClient(baseUrl, accountStreamerUrl)
const accountStreamer = tastytradeClient.accountStreamer
const loginResponse = await tastytradeClient.sessionService.login(usernameOrEmail, password)
const accounts = await tastytradeClient.accountsAndCustomersService.getCustomerAccounts()
const accountNumbers = _.map(accounts, account => _.get(account, 'account.account-number'))
await accountStreamer.start()
await accountStreamer.subscribeToAccounts(accountNumbers)
accountStreamer.addMessageObserver(handleStreamerMessage)
accountStreamer.addStreamerStateObserver(handleStreamerStateChange)
```

You should then be able to place a trade and see live status updates for the order come through via `handleStreamerMessage`.

## Running in Node
The `cometd` package has an explicit reference to `window`, so there's not a perfect way to run this code in a NodeJs. You could fake the `window` object to get it running. You'll have to `npm install ws` and do this:

```js
const WebSocket = require('ws')

global.WebSocket = WebSocket
global.window = { WebSocket, setTimeout, clearTimeout }
```

## Building Locally
`npm run build`
Outputs everything to `dist/`

## Running tests locally
Add a `.env` file with the following keys (you'll have to fill in the values yourself):

```
BASE_URL=https://api.cert.tastyworks.com
API_USERNAME=<your cert username>
API_PASSWORD=<your cert password>
API_ACCOUNT_NUMBER=<your cert account number>
```

## Running example app
```sh
npm run build
cd examples/
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Tests
Unit tests are for specific pieces of code and should not make any external calls (http requests). If needed, you can mock out an http response in your unit test.

For testing actual api requests, use the `tests/integration` folder.

Directory structure should match the `lib` structure. Service tests will go in `tests/unit/service/<servicefilename>.test.ts`
