import { SELF } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'
import { getAccessTokenCookie } from '../../src/app/worker'
import { getDefaultJWTService } from '../../src/infrastructure/services/JWTService'

const runIntegration =
  typeof process !== 'undefined' &&
  typeof process.env !== 'undefined' &&
  process.env.RUN_INTEGRATION === '1'

const describeIntegration = runIntegration ? describe : describe.skip

describeIntegration('GraphQL worker', () => {
  it('serves an authenticated query', async () => {
    const jwtService = await getDefaultJWTService()
    const { accessToken } = await jwtService.createTokens('test-user')
    const cookie = getAccessTokenCookie('cookie-secret')
    const serialized = await cookie.serialize(accessToken)
    const cookieHeader = serialized.split(';')[0] ?? serialized

    const response = await SELF.fetch('http://example.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        query: 'query { __typename }',
      }),
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      data?: { __typename?: string }
      errors?: unknown
    }

    expect(body.errors).toBeUndefined()
    expect(body.data?.__typename).toBe('Query')
  })
})
