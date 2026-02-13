# @tastytrade/api
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [7.0.0] - 2026-02-13

**⚠️ BREAKING CHANGES - See [UPGRADING.md](UPGRADING.md) for migration guide**

### Added

- Added automatic token refresh in AccountStreamer.send() method

### Changed

- BREAKING: TastytradeHttpClient constructor now requires full ClientConfig instead of Partial<ClientConfig>
- BREAKING: OAuth fields in ClientConfig are now required (not optional): clientSecret, refreshToken, and oauthScopes
- BREAKING: AccountStreamer constructor now accepts TastytradeHttpClient instead of separate TastytradeSession and AccessToken parameters
- BREAKING: AccountStreamer.send(), subscribeTo(), and subscribeToUser() methods are now async and return Promise<number>
- BREAKING: ClientConfig type requires clientSecret, refreshToken, and oauthScopes (no longer optional)
- TastytradeClient.ProdConfig and SandboxConfig now return Partial<ClientConfig> instead of full ClientConfig
- TastytradeHttpClient.needsTokenRefresh getter now only checks access token expiration (removed session checks)
- TastytradeHttpClient.authHeader getter now only returns access token (removed session token logic)
- AccountStreamer.authHeader getter now delegates to httpClient.authHeader
- AccountStreamer.subscribeToUser() now returns rejected promise with error message for invalid user IDs
- Updated JSDoc in AccountStreamer to remove session references

### Removed

- BREAKING: Removed lib/models/tastytrade-session.ts - session-based authentication no longer supported
- BREAKING: Removed lib/services/session-service.ts - no more login(), logout(), or validate() methods
- BREAKING: Removed session property from TastytradeHttpClient
- BREAKING: Removed sessionService property from TastytradeClient
- BREAKING: Removed session getter from TastytradeClient

## [6.0.0] - 2025-10-01

### Added

- Added `QuoteStreamer` wrapper for DxFeed's DxLink streamer package for market data
- Added `heartbeatInterval` parameter to `AccountStreamer` constructor (default: 20 seconds)
- Added unit tests for HTTP client
- Setup Prettier for consistent code formatting [#54](https://github.com/tastytrade/tastytrade-api-js/pull/54)

### Changed

- Updated Jest configuration to support ESM modules and transform `@dxfeed` packages
- Fixed integration and unit tests to work with current codebase
- Updated README with:
  - OAuth authentication instructions
  - API version targeting instructions
  - QuoteStreamer usage instructions
  - Session-based auth deprecation notice
- Updated dependency versions [#52](https://github.com/tastytrade/tastytrade-api-js/pull/52)
- Enabled builds on latest LTS Node version [#53](https://github.com/tastytrade/tastytrade-api-js/pull/53)

### Removed

- Removed the deprecated `MarketDataStreamer` and replaced it with `QuoteStreamer`

### Fixed

- Fixed Jest hanging after tests complete by adding `forceExit: true` configuration

## [5.0.0] - 2024-09-17

The `TastytradeClient` constructor now takes a single config object instead of 2 urls.

### Changed

- Add optional logging; update example app [#44](https://github.com/tastytrade/tastytrade-api-js/pull/44)
- Add future option quote streaming example to README

### Fixed

- Update README.md [#42](https://github.com/tastytrade/tastytrade-api-js/pull/35)
- README corrections
- typo on json account node name [#39](https://github.com/tastytrade/tastytrade-api-js/pull/39)

## [4.0.0] - 2024-03-12

### Changed

- Tsconfig library updates [#35](https://github.com/tastytrade/tastytrade-api-js/pull/35)
- target modern JS modules [#30](https://github.com/tastytrade/tastytrade-api-js/pull/30)
- Deprecate MarketDataStreamer [#29](https://github.com/tastytrade/tastytrade-api-js/pull/29)
- Target moden node runtimes [#22](https://github.com/tastytrade/tastytrade-api-js/pull/22)

### Fixed

- add missing return in getDefaultHeaders [#32](https://github.com/tastytrade/tastytrade-api-js/pull/32)
- Dont set User-Agent header in browser environment [#28](https://github.com/tastytrade/tastytrade-api-js/pull/28)

### Removed

- Remove https.Agent in `tastytrade-http-client` [#24](https://github.com/tastytrade/tastytrade-api-js/pull/24)
- Remove un-needed types dependency [#21](https://github.com/tastytrade/tastytrade-api-js/pull/21)