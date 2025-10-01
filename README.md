# Tastytrade Api Javascript SDK

## Installation
npm:
```bash
npm i @tastytrade/api
```

yarn:
```bash
yarn add @tastytrade/api
```

## Quickstart

### Session-based Authentication
Session auth is deprecated for Api users. Please migrate to Oauth (instructions below). You can create an Oauth application for your own account by going to [my.tastytrade.com](https://my.tastytrade.com/app.html#/manage/api-access/open-api/).

```js
import TastytradeClient from "@tastytrade/api"

// Use built-in configs or provide your own
const tastytradeClient = new TastytradeClient(TastytradeClient.ProdConfig)
// Or for sandbox: new TastytradeClient(TastytradeClient.SandboxConfig)

await tastytradeClient.sessionService.login(usernameOrEmail, password)
const accounts = await tastytradeClient.accountsAndCustomersService.getCustomerAccounts()
const accountPositions = await tastytradeClient.balancesAndPositionsService.getPositionsList(accounts[0].account['account-number'])
```

### OAuth Authentication
For OAuth-based authentication, provide `clientSecret`, `refreshToken`, and `oauthScopes` when instantiating the client:

```js
import TastytradeClient from "@tastytrade/api"

const tastytradeClient = new TastytradeClient({
  ...TastytradeClient.ProdConfig,
  clientSecret: 'your-client-secret',
  refreshToken: 'your-refresh-token',
  oauthScopes: ['read', 'trade'] // Specify required scopes
})

// Access tokens are automatically generated and refreshed
const accounts = await tastytradeClient.accountsAndCustomersService.getCustomerAccounts()
```

The client will automatically generate and refresh access tokens as needed. No need to call `login()` when using OAuth.

### Targeting a Specific API Version
New Api versions are outlined in our [Release Notes](https://developer.tastytrade.com/release-notes/) docs.

You can optionally target a specific API version by providing `targetApiVersion` when instantiating the client:

```js
import TastytradeClient from "@tastytrade/api"

const tastytradeClient = new TastytradeClient({
  ...TastytradeClient.ProdConfig,
  targetApiVersion: '20250813' // YYYYMMDD format
})
```

This will add an `Accept-Version` header to all API requests. If not specified, the latest API version will be used.

You can also override default headers via `axios`:
```
axios.defaults.headers.common['Accept-Version'] = '20250813';
```

### Market Data
We provide a wrapper for DxFeed's `@dxfeed/dxlink-api` package for retrieving quotes and candles. Once logged in, call `connect()` to fetch a quote auth token and connect to the DxLink streamer.

**Important:** Call `connect()` before `subscribe()`.

```js
import TastytradeClient, { CandleType } from "@tastytrade/api"

const tastytradeClient = new TastytradeClient(TastytradeClient.ProdConfig)
await tastytradeClient.sessionService.login(usernameOrEmail, password)

// Add event listener before connecting
tastytradeClient.quoteStreamer.addEventListener((events) => {
  console.log('Received market data:', events)
})

// Connect first
await tastytradeClient.quoteStreamer.connect()

// Then subscribe to symbols
tastytradeClient.quoteStreamer.subscribe(['AAPL', 'TSLA'])

// Subscribe to 5 minute candles starting from 1 year ago
tastytradeClient.quoteStreamer.subscribeCandles('AAPL', new Date().setFullYear(new Date().getFullYear() - 1), 5, CandleType.Minute)

// Disconnect when done
await tastytradeClient.quoteStreamer.disconnect()
```

To run the above code, save it to a file and run `node <filename>.js` in a terminal.

When subscribing to options, use the `put-streamer-symbol` or `call-streamer-symbol` from the `GET /futures-option-chains/{future_contract_code}/nested` endpoint:
```js
// GET /futures-option-chains/ES/nested response:
{
  "strike-price": "5750.0",
  "call": "./ESU4 EW4Q4 240823C5750",
  "call-streamer-symbol": "./EW4Q24C5750:XCME", <-- use this value
  "put": "./ESU4 EW4Q4 240823P5750",
  "put-streamer-symbol": "./EW4Q24P5750:XCME" <-- or this value
}
```

For equities quotes, use the ticker symbol (e.g., `AAPL`).

### Account Streamer
```js
import TastytradeClient from "@tastytrade/api"
import _ from 'lodash'

function handleStreamerMessage(json) {
  console.log('streamer message received: ', json)
}

function handleStreamerStateChange(streamerState) {
  console.log('streamer state changed: ', streamerState)
}

const tastytradeClient = new TastytradeClient({ baseUrl, accountStreamerUrl })
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

These values should match whatever username/password/account you set up in the tastytrade sandbox environment. Head to developer.tastyworks.com to get that set up.

Run tests:
```bash
npm test                # Run all tests
npm run unit-test       # Run unit tests only
npm run integration-test # Run integration tests only
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
