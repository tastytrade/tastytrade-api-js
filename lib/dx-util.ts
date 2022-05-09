import dayjs from 'dayjs'
import { AssetType, Security, EquityOptionSecurity } from './security'
import { CRYPTO_SYMBOL_REGEX } from './crypto-util'

const DATE_FORMAT = 'YYMMDD'
const DX_CRYPTO_SUFFIX = ":CXTALP";

export function toDxSymbol(security: Security): string {
  switch (security.type) {
    case AssetType.Equity:
    case AssetType.Index:
      return toDxEquitySymbol(security)
    case AssetType.EquityOption:
      return toDxOptionSymbol(security)
    case AssetType.Cryptocurrency:
      return toDxCryptoSymbol(security)
    default:
      // Assume Equity
      return toDxEquitySymbol(security)
  }
}

export function toDxEquitySymbol(security: Security): string {
  return security.underlying.symbol
}

export function toDxOptionSymbol(security: Security): string {
  if (!security.isEquityOption) {
    throw new Error(`${security.symbol} is not an option security`)
  }

  const optionSecurity = security as EquityOptionSecurity

  const expirationStr = dayjs(optionSecurity.expirationDate).tz('America/New_York').format(DATE_FORMAT)
  const strikeStr = optionSecurity.strikePrice.toString()
  return `.${optionSecurity.rootSymbol}${optionSecurity.optionChainType}${expirationStr}${optionSecurity.callOrPut[0]}${strikeStr}`
}

function isDxCryptoSymbol(symbol: string) {
  return CRYPTO_SYMBOL_REGEX.test(symbol) && symbol.endsWith(DX_CRYPTO_SUFFIX)
}

export function toDxCryptoSymbol(security: Security) {
  if (!security.isCryptocurrency) {
    return security.symbol
  }

  if (isDxCryptoSymbol(security.symbol)) {
    return security.symbol
  }
  return `${security.symbol}${DX_CRYPTO_SUFFIX}`
}