import TastytradeClient, { CandleType } from "@tastytrade/api";
import dayjs from "dayjs";
import _ from 'lodash';

console.log('Initializing Tastytrade client');
const tastytradeClient = new TastytradeClient({
  baseUrl: TastytradeClient.ProdConfig.baseUrl!,
  accountStreamerUrl: TastytradeClient.ProdConfig.accountStreamerUrl!,
  clientSecret: process.env.TT_CLIENT_SECRET!,
  refreshToken: process.env.TT_REFRESH_TOKEN!,
  oauthScopes: ['read', 'trade'] // Specify required scopes
});
console.log('Tastytrade client initialized');

const streamer = tastytradeClient.quoteStreamer;


console.log('Attempting to connect to quote streamer');
// Connect first
try {
  await streamer.connect();
  console.log('Successfully connected to quote streamer');
} catch (error) {
  console.error('Failed to connect to quote streamer:', error);
  throw error;
}
const symbol = `AAPL`;

/**
 * STREAMER SETUP FOR CANDLES
 */
type CandleData = {
  open: number,
  close: number,
  high: number,
  low: number,
  time: number,
  volume: number,
}

streamer.addEventListener((events) => {
  events.map((event) => {
    const candle = event as unknown as CandleData;
    const {open, high, low, close, volume, time} = candle;
    console.log(event);
    console.log("====unpacked time: ", time)
    console.log("====event.time: ", _.get(event, 'time'))
    console.log("====candle.time: ", _.get(candle, 'time'))
    console.log( {
      time: dayjs(time).toISOString(),
      open,
      high,
      low,
      close,
    })
  })
});

streamer.subscribeCandles(symbol, dayjs().startOf('date').subtract(1, 'week').valueOf(), 1, CandleType.Day); 
console.log('Candle subscription added');