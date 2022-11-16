## Tastyworks Streaming Data
This is a demo javascript app to demonstrate 2 things:
1. How to parse Tastyworks equity and equity option symbols and open a websocket connection with our quote provider.
2. How to open a websocket connection with Tastyworks to receive live account updates (trades, balances, etc)

This code shall not be used in production applications. This is for learning purposes only.

## Running Locally

Replace the demo `token` and `wsUrl` in `quote-streamer.tsx` with a tastyworks account streamer token and url.

token and wsUrl are fetched from the `GET /quote-streamer-tokens` endpoint using your session token.

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.