import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuditActionExecutor } from '../../../../src/application/services/AuditActionExecutor'
import { withAuditedAction } from '../../../../src/application/services/withAuditedAction'

describe('withAuditedAction', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('wraps a request-based action and forwards route metadata', async () => {
    const executeSpy = vi
      .spyOn(AuditActionExecutor.prototype, 'execute')
      .mockImplementation(async (options) => {
        expect(options.action).toBe('logout')
        expect(options.resourceType).toBe('auth_session')
        expect(options.resourceUid).toBe('session-1')
        expect(options.actorUserUid).toBe('user-1')
        expect(options.actorLabel).toBe('admin')
        expect(options.requestPayload).toEqual({
          refreshToken: 'refresh-1',
        })
        expect(options.metadata).toEqual({
          transport: 'http_route',
          route: {
            name: 'logout',
          },
          request: {
            method: 'POST',
            url: 'http://example.com/logout?mode=json',
            userAgent: 'vitest',
            requestId: 'req-1',
          },
          responseMode: 'json',
        })

        return options.run()
      })

    const action = withAuditedAction(
      {
        action: 'logout',
        resourceType: 'auth_session',
        routeName: 'logout',
        getRequestPayload: (input: never) => input,
        getInitialResourceUid: async () => 'session-1',
        getActorUserUid: async () => 'user-1',
        getActorLabel: () => 'admin',
        getMetadata: async () => ({ responseMode: 'json' }),
      },
      async () => ({ ok: true }),
    )

    const result = await action(
      {
        refreshToken: 'refresh-1',
      },
      {
        db: {} as never,
        request: new Request('http://example.com/logout?mode=json', {
          method: 'POST',
          headers: {
            'user-agent': 'vitest',
            'x-request-id': 'req-1',
          },
        }),
      },
    )

    expect(result).toEqual({ ok: true })
    expect(executeSpy).toHaveBeenCalledTimes(1)
  })
})
