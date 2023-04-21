export enum OptionChainType {
  STANDARD = '',
  NS1 = '1',
  NS2 = '2',
  NS3 = '3',
  NS4 = '4',
  NS5 = '5',
  NS6 = '6',
  MINI7 = '7',
  MINI8 = '8',
  MINI9 = '9'
}

export const OPTION_CHAIN_TYPE_VALUES = Object.values(OptionChainType) as string[]

export function toOptionChainType(raw: string): OptionChainType {
  if (OPTION_CHAIN_TYPE_VALUES.indexOf(raw) === -1 || raw === 'Standard') {
    return OptionChainType.STANDARD
  }

  return raw as OptionChainType
}

export enum OptionType {
  Call = 'Call',
  Put = 'Put'
}

export function toOptionType(raw: string): OptionType {
  if (raw[0].toLowerCase() === 'c') {
    return OptionType.Call
  } else {
    return OptionType.Put
  }
}

export const STRIKE_PRICE_FACTOR = 1000

export const OCC_SYMBOL_GROUPS = 8
export const OCC_SYMBOL_REGEX = /^([A-Z]{1,5})(\d?)[ ]{0,5}(\d{2})(\d{2})(\d{2})([CP])(\d{8})$/

export const NORMALIZED_UNDERLYING_SYMBOLS = Object.freeze(
  new Map([
    ['SPXW', 'SPX'], // SPX Weeklys have a different underlying
    ['SPXQ', 'SPX'], // SPX Quarterlys have a different underlying
    ['RUTW', 'RUT'], // RUT Weeklys
    ['NDXP', 'NDX'], // NDX PM Weeklys
    ['BFA', 'BF/A'],
    ['BFB', 'BF/B'],
    ['BRKB', 'BRK/B'],
    ['CBSA', 'CBS/A'],
    ['EBRB', 'EBR/B'],
    ['FCEA', 'FCE/A'],
    ['HEIA', 'HEI/A'],
    ['JWA', 'JW/A'],
    ['LGFA', 'LGF/A'],
    ['NYLDA', 'NYLD/A'],
    ['MOGA', 'MOG/A'],
    ['PBRA', 'PBR/A'],
    ['RDSA', 'RDS/A'],
    ['RDSB', 'RDS/B'],
    ['VALEP', 'VALE/P']
  ])
)

export const AM_SETTLED_ROOT_SYMBOLS = Object.freeze(
  new Set([
    '2DJX',
    '2NDX',
    '2OSX',
    '2RUT',
    '2SPX',
    '2VIX',
    'AUM',
    'AUX',
    'BJE',
    'BKX',
    'BPX',
    'BRB',
    'BSZ',
    'BVZ',
    'BZJ',
    'CDD',
    'DJX',
    'EUI',
    'EUU',
    'FTEM',
    'FXTM',
    'GBP',
    'GESPY',
    'GVZ',
    'HGX',
    'JBV',
    'KBK',
    'MNX',
    'NDO',
    'NDX',
    'NZD',
    'OSX',
    'OVX',
    'PZO',
    'RLG',
    'RLV',
    'RMN',
    'RUI',
    'RUT',
    'RVX',
    'SFC',
    'SKA',
    'SOX',
    'SPX',
    'UKXM',
    'VIX',
    'VXEEM',
    'VXEWZ',
    'VXST',
    'XAL',
    'XDA',
    'XDB',
    'XDC',
    'XDE',
    'XDN',
    'XDS',
    'XDZ',
    'XNG',
    'XSPAM',
    'YUK'
  ])
)