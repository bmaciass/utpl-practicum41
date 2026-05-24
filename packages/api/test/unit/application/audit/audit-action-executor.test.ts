import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  AuditActionExecutor,
  REDACTED_VALUE,
} from '../../../../src/application/services/AuditActionExecutor'

describe('AuditActionExecutor', () => {
  const auditEventRepository = {
    createPending: vi.fn(),
    markSucceeded: vi.fn(),
    markFailed: vi.fn(),
  }

  const userRepository = {
    findByUid: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    auditEventRepository.createPending.mockResolvedValue({ uid: 'audit-1' })
    auditEventRepository.markSucceeded.mockResolvedValue({ uid: 'audit-1' })
    auditEventRepository.markFailed.mockResolvedValue({ uid: 'audit-1' })
    userRepository.findByUid.mockResolvedValue({ id: 7, uid: 'user-1' })
  })

  it('creates a pending audit event and marks success with redacted data', async () => {
    const executor = new AuditActionExecutor({
      auditEventRepository: auditEventRepository as never,
      userRepository: userRepository as never,
    })

    const result = await executor.execute({
      action: 'update',
      resourceType: 'user',
      resourceUid: 'user-1',
      actorUserUid: 'user-1',
      requestPayload: {
        password: 'secret123',
        profile: { accessToken: 'token-1', firstName: 'Alice' },
      },
      metadata: {
        authorization: 'Bearer token-2',
      },
      beforeSnapshot: {
        salt: 'salt-1',
        name: 'alice',
      },
      afterSnapshot: (value) => value,
      run: async () => ({
        uid: 'user-1',
        passwordHash: 'hash-1',
        active: true,
      }),
    })

    expect(result).toEqual({
      uid: 'user-1',
      passwordHash: 'hash-1',
      active: true,
    })
    expect(auditEventRepository.createPending).toHaveBeenCalledWith({
      action: 'update',
      resourceType: 'user',
      resourceUid: 'user-1',
      actorUserId: 7,
      actorLabel: null,
      requestPayload: {
        password: REDACTED_VALUE,
        profile: { accessToken: REDACTED_VALUE, firstName: 'Alice' },
      },
      metadata: {
        authorization: REDACTED_VALUE,
      },
    })
    expect(auditEventRepository.markSucceeded).toHaveBeenCalledWith({
      uid: 'audit-1',
      resourceUid: 'user-1',
      beforeSnapshot: {
        salt: REDACTED_VALUE,
        name: 'alice',
      },
      afterSnapshot: {
        uid: 'user-1',
        passwordHash: REDACTED_VALUE,
        active: true,
      },
      metadata: {
        authorization: REDACTED_VALUE,
      },
    })
  })

  it('marks failed audit events and rethrows errors', async () => {
    const executor = new AuditActionExecutor({
      auditEventRepository: auditEventRepository as never,
      userRepository: userRepository as never,
    })

    const error = new Error('boom')
    Reflect.set(error, 'cause', {
      refreshToken: 'refresh-token-1',
    })

    await expect(
      executor.execute({
        action: 'refresh',
        resourceType: 'auth_session',
        actorLabel: 'admin',
        requestPayload: { refreshToken: 'refresh-token-1' },
        run: async () => {
          throw error
        },
      }),
    ).rejects.toThrow('boom')

    expect(auditEventRepository.markFailed).toHaveBeenCalledWith({
      uid: 'audit-1',
      resourceUid: null,
      beforeSnapshot: null,
      error: {
        name: 'Error',
        message: 'boom',
        stack: expect.any(String),
        cause: {
          refreshToken: REDACTED_VALUE,
        },
      },
      metadata: null,
    })
  })
})
