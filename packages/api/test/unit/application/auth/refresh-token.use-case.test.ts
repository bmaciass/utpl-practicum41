import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RefreshTokenUseCase } from '../../../../src/application/use-cases/auth/RefreshToken'

describe('RefreshTokenUseCase', () => {
  const jwtServiceMock = {
    hashToken: vi.fn(),
    compareTokenHash: vi.fn(),
    createTokens: vi.fn(),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
    refreshAccessToken: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rotates the refresh session and returns a new token pair', async () => {
    const authSessionRepository = {
      findByUid: vi.fn(async () => ({
        id: 10,
        uid: 'session-1',
        userId: 7,
        tokenHash: 'hashed-old-refresh-token-id',
        expiresAt: new Date('2026-08-01T00:00:00.000Z'),
        idleExpiresAt: new Date('2026-07-01T00:00:00.000Z'),
        lastUsedAt: new Date('2026-06-01T00:00:00.000Z'),
        revokedAt: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: null,
      })),
      rotate: vi.fn(async (_uid: string, input: { tokenHash: string }) => ({
        id: 10,
        uid: 'session-1',
        userId: 7,
        tokenHash: input.tokenHash,
        expiresAt: new Date('2026-08-01T00:00:00.000Z'),
        idleExpiresAt: new Date('2026-07-15T00:00:00.000Z'),
        lastUsedAt: new Date('2026-06-02T00:00:00.000Z'),
        revokedAt: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: new Date('2026-06-02T00:00:00.000Z'),
      })),
    }
    const userRepository = {
      findById: vi.fn(async () => ({
        id: 7,
        uid: 'user-1',
        active: true,
      })),
    }
    const roleRepository = {
      findByUserId: vi.fn(async () => [
        {
          name: 'admin',
          permissions: [{ scope: 'resource', action: 'read', effect: 'allow' }],
        },
      ]),
    }

    jwtServiceMock.verifyRefreshToken.mockResolvedValue({
      sub: 'user-1',
      sessionId: 'session-1',
      tokenId: 'old-refresh-token-id',
    })
    jwtServiceMock.compareTokenHash.mockResolvedValue(true)
    jwtServiceMock.hashToken.mockResolvedValue('hashed-new-refresh-token-id')
    jwtServiceMock.createTokens.mockResolvedValue({
      accessToken: 'access-2',
      refreshToken: 'refresh-2',
      accessTokenExpiresAt: new Date('2026-06-02T00:10:00.000Z'),
      refreshTokenExpiresAt: new Date('2026-08-01T00:00:00.000Z'),
    })

    const result = await new RefreshTokenUseCase({
      authSessionRepository: authSessionRepository as never,
      jwtService: jwtServiceMock as never,
      roleRepository: roleRepository as never,
      userRepository: userRepository as never,
    }).execute({
      refreshToken: 'refresh-1',
    })

    expect(authSessionRepository.findByUid).toHaveBeenCalledWith('session-1')
    expect(jwtServiceMock.compareTokenHash).toHaveBeenCalledWith(
      'old-refresh-token-id',
      'hashed-old-refresh-token-id',
    )
    expect(authSessionRepository.rotate).toHaveBeenCalledTimes(1)
    expect(jwtServiceMock.createTokens).toHaveBeenCalledWith(
      'user-1',
      {
        roles: ['admin'],
        permissions: ['resource:read:allow'],
      },
      {
        sessionId: 'session-1',
        tokenId: expect.any(String),
        expiresAt: new Date('2026-08-01T00:00:00.000Z'),
      },
    )
    expect(result.accessToken).toBe('access-2')
    expect(result.refreshToken).toBe('refresh-2')
  })

  it('rejects rotated refresh tokens', async () => {
    const authSessionRepository = {
      findByUid: vi.fn(async () => ({
        id: 10,
        uid: 'session-1',
        userId: 7,
        tokenHash: 'hashed-old-refresh-token-id',
        expiresAt: new Date('2026-08-01T00:00:00.000Z'),
        idleExpiresAt: new Date('2026-07-01T00:00:00.000Z'),
        lastUsedAt: new Date('2026-06-01T00:00:00.000Z'),
        revokedAt: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: null,
      })),
    }

    jwtServiceMock.verifyRefreshToken.mockResolvedValue({
      sub: 'user-1',
      sessionId: 'session-1',
      tokenId: 'stale-refresh-token-id',
    })
    jwtServiceMock.compareTokenHash.mockResolvedValue(false)

    await expect(
      new RefreshTokenUseCase({
        authSessionRepository: authSessionRepository as never,
        jwtService: jwtServiceMock as never,
        roleRepository: {} as never,
        userRepository: {} as never,
      }).execute({
        refreshToken: 'stale-refresh-token',
      }),
    ).rejects.toThrow('Refresh token rotated')
  })
})
