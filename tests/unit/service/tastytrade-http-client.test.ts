import TastytradeHttpClient from "../../../lib/services/tastytrade-http-client";
import nock from 'nock'

const BaseUrl = 'https://fakeurl.org'
const AccountStreamerUrl = 'https://fake.streamer.fake'
const ClientSecret = 'fakeClientSecret'
const RefreshToken = 'fakeRefreshToken'
const OauthScopes = ['trade', 'read']

function createClient() {
  return new TastytradeHttpClient({
    baseUrl: BaseUrl,
    accountStreamerUrl: AccountStreamerUrl,
    clientSecret: ClientSecret,
    refreshToken: RefreshToken,
    oauthScopes: OauthScopes
  })
}

describe('needsTokenRefresh', () => {
  it('returns false if accessToken is valid', function() {
    const client = createClient()
    client.accessToken.token = 'validtoken'
    client.accessToken.expiresIn = 3600
    expect(client.needsTokenRefresh).toBe(false)
  })

  it('returns true if accessToken is expired', function() {
    const client = createClient()
    client.accessToken.token = 'validtoken'
    client.accessToken.expiresIn = 0
    expect(client.needsTokenRefresh).toBe(true)
  })
})

describe('authHeader', () => {
  it('returns access token if AccessToken is valid', function() {
    const client = createClient()
    client.accessToken.token = 'validtoken'
    client.accessToken.expiresIn = 3600
    expect(client.authHeader).toEqual('Bearer validtoken')
  })

  it('returns null if access token is invalid', function() {
    const client = createClient()
    expect(client.authHeader).toEqual(null)
  })
})

describe('generateAccessToken', () => {
  it('throws an error if missing oauth credentials', async function() {
    const client = new TastytradeHttpClient({
      baseUrl: BaseUrl,
      accountStreamerUrl: AccountStreamerUrl
    })
    await expect(client.generateAccessToken()).rejects.toThrow('Missing required parameters to generate access token (refreshToken, clientSecret, oauthScopes)')
  })
})

describe('updateConfig', () => {
  it('updates config values', function() {
    const client = createClient()
    const newClientSecret = 'newFakeClientSecret'
    const newRefreshToken = 'newFakeRefreshToken'
    const newOauthScopes = ['trade']

    client.updateConfig({
      baseUrl: 'https://newfakeurl.org',
      clientSecret: newClientSecret,
      refreshToken: newRefreshToken,
      oauthScopes: newOauthScopes
    })

    expect(client.baseUrl).toEqual(BaseUrl) // Can't update baseUrl after initialization
    expect(client.clientSecret).toEqual(newClientSecret)
    expect(client.refreshToken).toEqual(newRefreshToken)
    expect(client.oauthScopes).toEqual(newOauthScopes)
  })

  it('invalidates access token', function() {
    const client = createClient()
    client.updateConfig({ targetApiVersion: '20250925' })

    expect(client.accessToken.token).toEqual('')
    expect(client.accessToken.expiresIn).toEqual(0)
  })

  it('includes api version in requests', async function() {
    const client = createClient()
    const targetApiVersion = '20250925'
    client.updateConfig({ targetApiVersion })
    client.accessToken.token = 'validtoken'
    client.accessToken.expiresIn = 3600


    expect(client.targetApiVersion).toEqual(targetApiVersion)
    console.log('client.accessToken.token: ', client.accessToken.token, ' client.accessToken.expiresIn: ', client.accessToken.expiresIn)

    const scope = nock(BaseUrl)
      .get('/test-endpoint')
      .matchHeader('Accept', 'application/json')
      .matchHeader('Accept-Version', targetApiVersion)
      .reply(200, { data: 'test' })

    await client.getData('/test-endpoint')

    expect(scope.isDone()).toBe(true)
  })

  it('throws error if api version is invalid format', async function() {
    const client = createClient()
    client.accessToken.token = 'validtoken'
    client.accessToken.expiresIn = 3600
    expect(() => {
      client.targetApiVersion = 'invalid_version'
    }).toThrow('Invalid API version format. Expected YYYYMMDD.')
  })
})
