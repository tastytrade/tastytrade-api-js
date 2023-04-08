import DateHelper, { MONTHS } from './date-helper'
import { CRYPTO_SYMBOL_REGEX } from './crypto-util'
import {
  OptionType,
  OptionChainType,
  toOptionChainType,
  toOptionType,
  AM_SETTLED_ROOT_SYMBOLS,
  NORMALIZED_UNDERLYING_SYMBOLS,
  OCC_SYMBOL_REGEX,
  OCC_SYMBOL_GROUPS,
  STRIKE_PRICE_FACTOR
} from './option-util'

export enum AssetType {
  Equity = 'Equity',
  EquityOption = 'Equity Option',
  Index = 'Index',
  Cryptocurrency = 'Cryptocurrency',
  Unknown = 'Unknown'
}

export abstract class Security {
  // prettier-ignore
  constructor(
    readonly symbol: string,
    readonly type: AssetType,
    readonly rootSymbol: string
  ) { }

  abstract get underlying(): Security

  get isEquityOption() {
    return this.type === AssetType.EquityOption
  }

  get isEquityLike() {
    return this.type === AssetType.Equity ||
      this.type === AssetType.Index
  }

  get isCryptocurrency() {
    return this.type === AssetType.Cryptocurrency
  }
}

export class EquitySecurity extends Security {
  // prettier-ignore
  constructor(
    readonly symbol: string,
  ) {
    super(symbol, AssetType.Equity, symbol)
  }

  get underlying(): Security {
    return this
  }
}

export class CryptoSecurity extends Security {
  // prettier-ignore
  constructor(
    readonly symbol: string
  ) {
    super(symbol, AssetType.Cryptocurrency, symbol)
  }

  get underlying(): Security {
    return this
  }
}

export abstract class OptionSecurity extends Security {
  constructor(
    symbol: string,
    assetType: AssetType,
    rootSymbol: string,
    readonly callOrPut: OptionType,
    readonly strikePrice: number,
    readonly expirationDate: Date
  ) {
    super(symbol, assetType, rootSymbol)
  }

  get isCall(): boolean {
    return this.callOrPut === OptionType.Call
  }

  get isPut(): boolean {
    return this.callOrPut === OptionType.Put
  }
}

export class EquityOptionSecurity extends OptionSecurity {
  constructor(
    symbol: string,
    rootSymbol: string,
    readonly underlying: Security,
    readonly optionChainType: OptionChainType,
    readonly callOrPut: OptionType,
    readonly strikePrice: number,
    readonly expirationDate: Date
  ) {
    super(symbol, AssetType.EquityOption, rootSymbol, callOrPut, strikePrice, expirationDate)
  }
}

function toEquityUnderlyingSecurty(symbol: string) {
  const normalizedSymbol = NORMALIZED_UNDERLYING_SYMBOLS.get(symbol)
  return new EquitySecurity(normalizedSymbol === undefined ? symbol : normalizedSymbol)
}

function toExpirationDate(year: string, monthRaw: string, day: string): DateHelper {
  const month: MONTHS = parseInt(monthRaw, 10) as MONTHS
  const yearFormatted = `20${year}`
  return new DateHelper().setYearMonthDay(parseInt(yearFormatted, 10), month, parseInt(day, 10))
}

function adjustEquityOptionExpirationDate(rootSymbol: string, dateHelper: DateHelper): Date {
  if (AM_SETTLED_ROOT_SYMBOLS.has(rootSymbol)) {
    return dateHelper.toStartOfTradingTime().toDate()
  } else {
    return dateHelper.toEndOfTradingTime().toDate()
  }
}

export function parseEquityOption(symbol: string): EquityOptionSecurity {
  const matches = OCC_SYMBOL_REGEX.exec(symbol)
  if (matches === null || matches.length !== OCC_SYMBOL_GROUPS) {
    throw new Error(`Invalid OCC Option symbol: ${symbol}`)
  }

  // tslint:disable:no-magic-numbers
  const rootSymbol = matches[1]
  const optionChainTypeStr = matches[2]
  const year = matches[3]
  const month = matches[4]
  const day = matches[5]
  const callOrPutStr = matches[6]
  const strikeStr = matches[7]
  // tslint:enable:no-magic-numbers

  const underlyingSecurity = toEquityUnderlyingSecurty(rootSymbol)
  const optionChainType = toOptionChainType(optionChainTypeStr)
  const parsedExpirationDate = toExpirationDate(year, month, day)
  const expirationDate = adjustEquityOptionExpirationDate(rootSymbol, parsedExpirationDate)
  const optionType = toOptionType(callOrPutStr)
  const strikePrice = parseFloat(strikeStr) / STRIKE_PRICE_FACTOR

  return new EquityOptionSecurity(symbol, rootSymbol, underlyingSecurity, optionChainType, optionType, strikePrice, expirationDate)
}

export function parseSecurity(rawSymbol: string, assetType?: string): Security | null {
  const symbol = rawSymbol.toUpperCase()
  // tslint:disable-next-line:strict-boolean-expressions
  if (assetType) {
    switch (assetType) {
      case AssetType.Equity:
      case AssetType.Index:
        return new EquitySecurity(symbol)
      case AssetType.EquityOption:
        return parseEquityOption(symbol)
      case AssetType.Cryptocurrency:
        return new CryptoSecurity(symbol)
      default:
        // Assume Equity
        return new EquitySecurity(symbol)
    }
  } else {
    const length = symbol.length
    if (length === 0) {
      return null
    }

    if (OCC_SYMBOL_REGEX.test(symbol)) {
      return parseEquityOption(symbol)
    }

    if (CRYPTO_SYMBOL_REGEX.test(symbol)) {
      return new CryptoSecurity(symbol)
    }

    // Assume it is an equity
    return new EquitySecurity(symbol)
  }
}
