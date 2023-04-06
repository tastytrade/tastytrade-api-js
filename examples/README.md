# Example React App
### Running locally
This example app links to the `tastytrade-api` npm package locally in the package.json.

Before running this, you need to compile the typescript in that package.

```
npm run build
cd examples
npm run dev
```

Any time you make changes to the code in the package (i.e. any code in `lib/`), you need to re-run `npm run build`.