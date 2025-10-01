/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.(tsx?|jsx?)$': [
      'ts-jest',
      {
        useESM: true,
        transpilation: true
      }
    ]
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@dxfeed)'],
  maxWorkers: 1,
  forceExit: true
}

export default config
