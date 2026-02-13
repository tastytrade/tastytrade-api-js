# Migration Guide: v6.0 → v7.0

## Overview

Version 7.0 removes session-based authentication entirely in favor of OAuth token-based authentication. This change simplifies the authentication flow and aligns with modern API security practices.

## Breaking Changes Summary

- ❌ **Removed**: `SessionService` (no more `login()`, `logout()`, `validate()`)
- ❌ **Removed**: `TastytradeSession` class
- ❌ **Removed**: `session` property from `TastytradeClient`
- ✅ **Required**: OAuth credentials (`clientSecret`, `refreshToken`, `oauthScopes`) now mandatory in `ClientConfig`
- ⚠️ **Changed**: `AccountStreamer` constructor signature
- ⚠️ **Changed**: Several `AccountStreamer` methods now async

## Migration Steps

### 1. Update TastytradeClient Initialization

#### Before (v6.0)

  ```typescript
  import TastytradeClient from 'tastytrade-api'

  const client = new TastytradeClient({
    baseUrl: 'https://api.tastyworks.com',
    accountStreamerUrl: 'wss://streamer.tastyworks.com'
  })

  // Login required before making API calls
  await client.sessionService.login(username, password)

  const accounts = await client.accountsAndCustomersService.getCustomerAccounts()
  ```

#### After (v7.0)

```typescript
  import TastytradeClient from 'tastytrade-api'

  const client = new TastytradeClient({
    baseUrl: 'https://api.tastyworks.com',
    accountStreamerUrl: 'wss://streamer.tastyworks.com',
    clientSecret: 'your-client-secret',
    refreshToken: 'your-refresh-token',
    oauthScopes: ['read', 'trade']
  })

  // No login needed - client automatically manages tokens
  const accounts = await client.accountsAndCustomersService.getCustomerAccounts()
```

  Or use the predefined configs:

```typescript
  const client = new TastytradeClient({
    ...TastytradeClient.ProdConfig,  // baseUrl + accountStreamerUrl
    clientSecret: 'your-client-secret',
    refreshToken: 'your-refresh-token',
    oauthScopes: ['read', 'trade']
  })
```

### 2. Remove All SessionService Usage

  Before (v6.0)

```typescript
  // Login
  await client.sessionService.login(username, password)

  // Login with remember token
  await client.sessionService.loginWithRememberToken(username, rememberToken)

  // Validate session
  const isValid = await client.sessionService.validate()

  // Logout
  await client.sessionService.logout()

  // Check if logged in
  if (client.session.isValid) {
    // Do something
  }
```

  After (v7.0)

```typescript
// Access tokens are refreshed automatically. No sessions or session tokens.
const client = new TastytradeClient(config)
await client.accountsAndCustomersService.getCustomerAccounts()
```

### 3. Update AccountStreamer Method Calls

  Several AccountStreamer methods now return promises:

  Before (v6.0)

```typescript
  await streamer.start()

  streamer.subscribeTo('action', value)
  streamer.subscribeToUser(userExternalId)
  const requestId = streamer.subscribeToAccounts(['account123'])
```

  After (v7.0)

```typescript
  await streamer.start()

  // Now async - must await
  await streamer.subscribeTo('action', value)
  await streamer.subscribeToUser(userExternalId)
  const requestId = await streamer.subscribeToAccounts(['account123'])
```
