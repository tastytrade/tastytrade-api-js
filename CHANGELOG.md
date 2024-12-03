# @tastytrade/api
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [6.0.0] - 2024-11-22

Added a `QuoteStreamer` which wraps the DxLink streamer javascript package.

### Changed

- Removed the deprecated MarketDataStreamer
- Updated README.md with instructions on using the new QuoteStreamer

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