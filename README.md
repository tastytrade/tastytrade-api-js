# Tastytrade Api Javascript SDK
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
