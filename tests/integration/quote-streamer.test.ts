// import { AccountStreamer } from "../../lib/account-streamer";
// import { TastytradeLogger } from "../../lib/logger";
// import TastytradeHttpClient from "../../lib/services/tastytrade-http-client";
// import SessionService from "../../lib/services/session-service";
// import AccountsAndCustomersService from "../../lib/services/accounts-and-customers-service";
// import QuoteStreamer from "../../lib/quote-streamer";

// const client = new TastytradeHttpClient({ baseUrl: process.env.BASE_URL! })
// const customerService = new AccountsAndCustomersService(client)
// const quoteStreamer = new QuoteStreamer(customerService, new TastytradeLogger())


// beforeAll(async () => {
//   const sessionService = new SessionService(client)
//   await sessionService.login(process.env.API_USERNAME!, process.env.API_PASSWORD!)
// });

// // describe('subscribeToAccounts', () => {
// //   it('subscribes successfully', async function() {
// //     let eventCount = 0
// //     const eventPromise = new Promise<void>((resolve, reject) => {
// //       const timeout = setTimeout(() => {
// //         reject(new Error('Timeout waiting for quote update'));
// //       }, 3000); // Increased timeout to 3 seconds

// //       quoteStreamer.addEventListener(_event => {
// //         eventCount += 1
// //         clearTimeout(timeout)
// //         resolve()
// //       })
// //     })

// //     try {
// //       quoteStreamer.subscribe(['AAPL'])
// //       await quoteStreamer.connect()
// //       await eventPromise
// //       expect(eventCount).toBeGreaterThan(0)
// //     } finally {
// //       // Ensure cleanup happens even if test fails
// //       await quoteStreamer.disconnect()
// //     }
// //   }, 10000) // Set Jest timeout to 10 seconds
// // })
