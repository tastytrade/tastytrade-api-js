/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

export default config;
