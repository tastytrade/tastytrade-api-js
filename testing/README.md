# Testing Project

Sandbox for testing `@tastytrade/api` features.

## Prerequisites

- Node.js >= v24.8.0
- npm >= 11.6.0
- TypeScript >= 5.8.0

## Setup

```bash
npm install
```

## Environment Variables

Set the following before running:

```bash
export TT_CLIENT_SECRET=<your-client-secret>
export TT_REFRESH_TOKEN=<your-refresh-token>
```

## Running

```bash
npm start
```

This runs `tsc` to compile TypeScript to `dist/`, then executes `dist/index.js` with Node.

## Project Structure

- `index.ts` — entry point (edit this)
- `tsconfig.json` — TypeScript config (target: ES2022, module: NodeNext)
- `dist/` — compiled output (gitignored)
