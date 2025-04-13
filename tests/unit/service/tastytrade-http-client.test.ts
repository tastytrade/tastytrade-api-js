import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import nock from 'nock'

const BaseUrl = 'https://fakeurl.org'

describe('TastytradeHttpClient', () => {
  let client: TastytradeHttpClient
  const sessionToken = 'test-token'

  beforeEach(() => {
    client = new TastytradeHttpClient({ baseUrl: BaseUrl, sessionToken })
    nock.cleanAll()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('constructor', () => {
    it('should initialize with string baseUrl', () => {
      const client = new TastytradeHttpClient(BaseUrl)
      expect(client['baseUrl']).toBe(BaseUrl)
      expect(client.session.authToken).toBeNull()
    })

    it('should initialize with options object', () => {
      const client = new TastytradeHttpClient({ baseUrl: BaseUrl, sessionToken })
      expect(client['baseUrl']).toBe(BaseUrl)
      expect(client.session.authToken).toBe(sessionToken)
    })
  })

  describe('getDefaultHeaders', () => {
    it('should return default headers with auth token', () => {
      const headers = client['getDefaultHeaders']()
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': sessionToken,
        'User-Agent': 'tastytrade-sdk-js'
      })
    })

    it('should not include User-Agent in browser environment', () => {
      // Mock window object
      const originalWindow = global.window
      global.window = {} as any

      const headers = client['getDefaultHeaders']()
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': sessionToken
      })

      // Restore window
      global.window = originalWindow
    })
  })

  describe('HTTP methods', () => {
    const testPath = '/test'
    const testData = { test: 'data' }
    const testParams = { param1: 'value1' }
    const testHeaders = { 'X-Custom': 'header' }
    const mockResponse = { success: true }

    it('getData should make GET request', async () => {
      nock(BaseUrl)
        .get(testPath)
        .query(testParams)
        .matchHeader('Authorization', sessionToken)
        .reply(200, mockResponse)

      const response = await client.getData(testPath, testHeaders, testParams)
      expect(response.data).toEqual(mockResponse)
    })

    it('postData should make POST request', async () => {
      nock(BaseUrl)
        .post(testPath, testData)
        .matchHeader('Authorization', sessionToken)
        .reply(200, mockResponse)

      const response = await client.postData(testPath, testData, testHeaders)
      expect(response.data).toEqual(mockResponse)
    })

    it('putData should make PUT request', async () => {
      nock(BaseUrl)
        .put(testPath, testData)
        .matchHeader('Authorization', sessionToken)
        .reply(200, mockResponse)

      const response = await client.putData(testPath, testData, testHeaders)
      expect(response.data).toEqual(mockResponse)
    })

    it('patchData should make PATCH request', async () => {
      nock(BaseUrl)
        .patch(testPath, testData)
        .matchHeader('Authorization', sessionToken)
        .reply(200, mockResponse)

      const response = await client.patchData(testPath, testData, testHeaders)
      expect(response.data).toEqual(mockResponse)
    })

    it('deleteData should make DELETE request', async () => {
      nock(BaseUrl)
        .delete(testPath)
        .matchHeader('Authorization', sessionToken)
        .reply(200, mockResponse)

      const response = await client.deleteData(testPath, testHeaders)
      expect(response.data).toEqual(mockResponse)
    })

    it('should handle error responses', async () => {
      nock(BaseUrl)
        .get(testPath)
        .reply(500, { error: 'Internal Server Error' })

      await expect(client.getData(testPath)).rejects.toThrow()
    })

    it('should handle network errors', async () => {
      nock(BaseUrl)
        .get(testPath)
        .replyWithError('Network error')

      await expect(client.getData(testPath)).rejects.toThrow()
    })
  })

  describe('parameter handling', () => {
    it('should properly serialize query parameters', async () => {
      const params = {
        arrayParam: ['value1', 'value2'],
        nested: { key: 'value' }
      }

      // Use a function to match the query parameters
      nock(BaseUrl)
        .get('/test')
        .query((actualQuery) => {
          const arrayParams = actualQuery['array-param[]']
          return Array.isArray(arrayParams) &&
                 arrayParams.includes('value1') &&
                 arrayParams.includes('value2') &&
                 actualQuery['nested[key]'] === 'value'
        })
        .reply(200, {})

      await client.getData('/test', {}, params)
    })

    it('should properly handle empty parameters', async () => {
      nock(BaseUrl)
        .get('/test')
        .reply(200, {})

      await client.getData('/test', {}, {})
    })
  })
})
