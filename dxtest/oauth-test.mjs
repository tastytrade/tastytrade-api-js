import TastytradeClient from "@tastytrade/api";

const client = new TastytradeClient({
  ...TastytradeClient.ProdConfig,
  clientSecret: 'your-client-secret',
  refreshToken: 'your-refresh-token',
  oauthScopes: ['read']
});

client.quoteStreamer.connect().then(() => {
  console.log('Connected to quote streamer');
})

console.log('OAuth test client initialized');
