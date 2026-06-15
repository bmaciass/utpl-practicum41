import { getDBConnection } from '@sigep/db'
import { SELF, env as testEnv } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'
import { getAccessTokenCookie } from '../../src/app/worker'
import { DrizzleAuditEventRepository } from '../../src/infrastructure/persistence/drizzle/repositories/DrizzleAuditEventRepository'
import { getDefaultJWTService } from '../../src/infrastructure/services/JWTService'

const runIntegration =
  typeof process !== 'undefined' &&
  typeof process.env !== 'undefined' &&
  process.env.RUN_INTEGRATION === '1'

const describeIntegration = runIntegration ? describe : describe.skip

async function createAccessCookie(
  userUid: string,
  claims?: { roles?: string[]; permissions?: string[] },
) {
  const jwtService = await getDefaultJWTService()
  const { accessToken } = await jwtService.createTokens(userUid, claims)
  const cookie = getAccessTokenCookie('cookie-secret')
  const serialized = await cookie.serialize(accessToken)

  return serialized.split(';')[0] ?? serialized
}

async function seedAuditEvent(overrides?: {
  actorLabel?: string
  action?: string
  resourceUid?: string
}) {
  const { db, client } = await getDBConnection(testEnv.HYPERDRIVE.connectionString)
  await client.connect()

  try {
    const repository = new DrizzleAuditEventRepository(db)
    const pendingEvent = await repository.createPending({
      action: overrides?.action ?? 'update',
      resourceType: 'project',
      resourceUid: overrides?.resourceUid ?? 'project-audit-1',
      actorLabel: overrides?.actorLabel ?? `audit-${crypto.randomUUID()}`,
      requestPayload: {
        authorization: 'Bearer super-secret-token',
      },
      metadata: {
        requestId: crypto.randomUUID(),
      },
    })

    return repository.markSucceeded({
      uid: pendingEvent.uid,
      resourceUid: overrides?.resourceUid ?? 'project-audit-1',
      beforeSnapshot: { active: false },
      afterSnapshot: { active: true },
      metadata: {
        requestId: crypto.randomUUID(),
      },
    })
  } finally {
    await client.end()
  }
}

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

  it('returns an explicit auth error when the access cookie is missing', async () => {
    const response = await SELF.fetch('http://example.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query { program { list { records { uid } } } }',
      }),
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      data?: { program?: { list?: { records?: Array<{ uid: string }> } } }
      errors?: Array<{ message?: string }>
    }

    expect(body.data).toBeNull()
    expect(body.errors?.[0]?.message).toBe(
      'Authentication required: access-token-cookie was missing from the request',
    )
  })

  it('allows admins to list audit events', async () => {
    const actorLabel = `audit-list-${crypto.randomUUID()}`
    const auditEvent = await seedAuditEvent({ actorLabel, action: 'create' })
    const cookieHeader = await createAccessCookie('admin-user', {
      roles: ['admin'],
    })

    const response = await SELF.fetch('http://example.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        query: `
          query AuditList($filters: AuditEventFiltersInput) {
            audit {
              list(filters: $filters, limit: 10, offset: 0) {
                total
                records {
                  uid
                  status
                  action
                  resourceType
                  actorLabel
                }
              }
            }
          }
        `,
        variables: {
          filters: {
            actorLabel,
          },
        },
      }),
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      data?: {
        audit?: {
          list?: {
            total: number
            records: Array<{
              uid: string
              status: string
              action: string
              resourceType: string
              actorLabel: string | null
            }>
          }
        }
      }
      errors?: Array<{ message?: string }>
    }

    expect(body.errors).toBeUndefined()
    expect(body.data?.audit?.list?.total).toBe(1)
    expect(body.data?.audit?.list?.records).toEqual([
      {
        uid: auditEvent.uid,
        status: 'succeeded',
        action: 'create',
        resourceType: 'project',
        actorLabel,
      },
    ])
  })

  it('allows admins to fetch one audit event detail', async () => {
    const auditEvent = await seedAuditEvent({
      actorLabel: `audit-detail-${crypto.randomUUID()}`,
      action: 'delete',
      resourceUid: 'project-audit-detail-1',
    })
    const cookieHeader = await createAccessCookie('admin-user', {
      roles: ['admin'],
    })

    const response = await SELF.fetch('http://example.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        query: `
          query AuditOne($uid: String!) {
            audit {
              one(uid: $uid) {
                uid
                status
                action
                resourceType
                resourceUid
                actorLabel
                requestPayload
                beforeSnapshot
                afterSnapshot
                error
                metadata
              }
            }
          }
        `,
        variables: {
          uid: auditEvent.uid,
        },
      }),
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      data?: {
        audit?: {
          one?: {
            uid: string
            status: string
            action: string
            resourceType: string
            resourceUid: string | null
            actorLabel: string | null
            requestPayload: Record<string, unknown> | null
            beforeSnapshot: Record<string, unknown> | null
            afterSnapshot: Record<string, unknown> | null
            error: Record<string, unknown> | null
            metadata: Record<string, unknown> | null
          }
        }
      }
      errors?: Array<{ message?: string }>
    }

    expect(body.errors).toBeUndefined()
    expect(body.data?.audit?.one).toEqual({
      uid: auditEvent.uid,
      status: 'succeeded',
      action: 'delete',
      resourceType: 'project',
      resourceUid: 'project-audit-detail-1',
      actorLabel: auditEvent.actorLabel,
      requestPayload: {
        authorization: 'Bearer super-secret-token',
      },
      beforeSnapshot: {
        active: false,
      },
      afterSnapshot: {
        active: true,
      },
      error: null,
      metadata: expect.objectContaining({
        requestId: expect.any(String),
      }),
    })
  })

  it('denies non-admin access to audit queries', async () => {
    const cookieHeader = await createAccessCookie('regular-user', {
      roles: ['user'],
    })

    const response = await SELF.fetch('http://example.com/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        query: `
          query {
            audit {
              list(limit: 1, offset: 0) {
                total
              }
            }
          }
        `,
      }),
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      data?: unknown
      errors?: Array<{ message?: string }>
    }

    expect(body.errors?.[0]?.message).toBe('Insufficient permissions')
  })
})
