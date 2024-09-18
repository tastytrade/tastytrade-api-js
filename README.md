# Tastytrade Api Javascript SDK

## Installation
npm:
`npm i @tastytrade/api`

yarn:
`yarn add @tastytrade/api`

## Quickstart
```js
import TastytradeClient from "@tastytrade/api"

const tastytradeApi = new TastytradeClient({ baseUrl, accountStreamerUrl })
const loginResponse = await tastytradeApi.sessionService.login(usernameOrEmail, password)
const accounts = await tastytradeApi.accountsAndCustomersService.getCustomerAccounts()
const accountPositions = await tastytradeApi.balancesAndPositionsService.getPositionsList(accounts[0].account['account-number'])
```

### Market Data
The MarketDataStreamer in this package is deprecated. We recommend using DxFeed's [@dxfeed/dxlink-api](https://github.com/dxFeed/dxLink/blob/main/dxlink-javascript/dxlink-api/README.md) instead.

Here's a node example of how you can subscribe to some future option quotes using `@dxfeed/dxlink-api`:
```js
/**
 * Below code assumes you've hit GET /api-quote-tokens and received a token
 * You should also hit GET /futures-option-chains/{future_contract_code}/nested to get the future options you want to subscribe to
 * There is an equivalent GET /option-chains/{underlying_ticker_symbol}/nested for equity options
 */

const WebSocket = require('isomorphic-ws')
const { DXLinkWebSocketClient, DXLinkFeed, FeedDataFormat } = require('@dxfeed/dxlink-api')
global.WebSocket = WebSocket

const token = '<api quote token>'
const client = new DXLinkWebSocketClient()
client.connect('wss://tasty-openapi-ws.dxfeed.com/realtime')
client.setAuthToken(token)

const feed = new DXLinkFeed(client, 'AUTO')

// Note: Calling feed.configure is optional - omitting it means DxLink will return all fields
feed.configure({
  acceptAggregationPeriod: 10,
  acceptDataFormat: FeedDataFormat.COMPACT,
  acceptEventFields: {
    Quote: ['eventSymbol', 'askPrice', 'bidPrice']
  },
})

feed.addEventListener((events) => {
  events.map(event => {
    console.log(event)
  })
})

feed.addSubscriptions({
  type: 'Quote',
  symbol: './EW4Q24C5750:XCME', // Please note: we don't update this README daily. This symbol may be expired. You'll have to find an unexpired symbol.
})
```

To run the above code, save it to a file and run `node <filename>.js` in a terminal.

When adding a subscription, the `symbol` value should be the `put-streamer-symbol` or `call-streamer-symbol` returned by the `GET /futures-option-chains/{future_contract_code}/nested` endpoint. For example:
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

To subscribe to equities quotes, the `symbol` is just the ticker symbol, like `AAPL`.

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
