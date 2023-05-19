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
import TastytradeClient, { QuoteStreamer } from "@tastytrade-api"
const tastytradeClient = new TastytradeClient(baseUrl, accountStreamerUrl)
await tastytradeClient.sessionService.login(usernameOrEmail, pasword)
const tokenResponse = await tastytradeClient.AccountsAndCustomersService.getQuoteStreamerTokens()
const quoteStreamer = new QuoteStreamer(tokenResponse.token, `${tokenResponse['websocket-url']}/cometd`)
quoteStreamer.connect()

function handleMarketDataReceived(event) {
  // Triggers every time market data event occurs
  console.log(event)
}
// Subscribe to a single equity quote
quoteStreamer.subscribe('AAPL', handleMarketDataReceived)

// Subscribe to a single equity option quote
const optionChain = await tastytradeClient.instrumentsService.getOptionChain('AAPL')
quoteStreamer.subscribe(optionChain[0]['streamer-symbol'], handleMarketDataReceived)
```

## Building Locally
`npm run build`
Outputs everything to `dist/`

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
