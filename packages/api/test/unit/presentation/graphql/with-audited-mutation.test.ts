import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuditActionExecutor } from '../../../../src/application/services/AuditActionExecutor'
import { withAuditedMutation } from '../../../../src/presentation/graphql/helpers/audit'

describe('withAuditedMutation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('wraps a resolver and forwards GraphQL-specific audit metadata', async () => {
    const executeSpy = vi
      .spyOn(AuditActionExecutor.prototype, 'execute')
      .mockImplementation(async (options) => {
        expect(options.action).toBe('update')
        expect(options.resourceType).toBe('goal')
        expect(options.resourceUid).toBe('goal-1')
        expect(options.actorUserUid).toBe('user-1')
        expect(options.requestPayload).toEqual({
          where: { uid: 'goal-1' },
          data: { active: false },
        })
        expect(options.metadata).toEqual({
          transport: 'graphql',
          graphql: {
            operationName: 'UpdateGoal',
            fieldName: 'update',
            parentType: 'GoalMutations',
          },
          request: {
            method: 'POST',
            url: 'http://example.com/graphql',
            userAgent: 'vitest',
            requestId: 'req-1',
          },
        })
        await expect(options.beforeSnapshot?.()).resolves.toEqual({
          uid: 'goal-1',
          active: true,
        })
        await expect(
          options.afterSnapshot?.({ uid: 'goal-1', active: false }),
        ).resolves.toEqual({
          uid: 'goal-1',
          active: false,
        })

        return options.run()
      })

    const resolver = withAuditedMutation(
      {
        action: 'update',
        resourceType: 'goal',
        getRequestPayload: ({ where, data }: never) => ({ where, data }),
        getInitialResourceUid: ({ where }: never) => where.uid,
        loadBefore: async () => ({ uid: 'goal-1', active: true }),
      },
      async () => ({ uid: 'goal-1', active: false }),
    )

    const result = await resolver(
      null,
      {
        where: { uid: 'goal-1' },
        data: { active: false },
      },
      {
        db: {} as never,
        client: {} as never,
        request: new Request('http://example.com/graphql', {
          method: 'POST',
          headers: {
            'user-agent': 'vitest',
            'x-request-id': 'req-1',
          },
        }),
        authenticated: true,
        auth: { failureReason: null },
        user: { uid: 'user-1' },
        token: { roles: ['admin'], permissions: [] },
        loaders: {} as never,
      },
      {
        operation: {
          name: { value: 'UpdateGoal' },
        },
        fieldName: 'update',
        parentType: {
          name: 'GoalMutations',
        },
      } as never,
    )

    expect(result).toEqual({ uid: 'goal-1', active: false })
    expect(executeSpy).toHaveBeenCalledTimes(1)
  })
})
