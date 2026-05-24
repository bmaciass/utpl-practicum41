import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginUseCase } from '../../../../src/application/use-cases/auth/Login'
import { PasswordService } from '../../../../src/infrastructure/services/PasswordService'

describe('LoginUseCase', () => {
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

  it('creates a persistent auth session and returns token expirations', async () => {
    const passwordService = new PasswordService()
    const { hash, salt } = passwordService.hashPassword('secret123')

    const authSessionRepository = {
      create: vi.fn(async () => ({
        id: 10,
        uid: 'session-1',
        userId: 7,
        tokenHash: 'hashed-refresh-token-id',
        expiresAt: new Date('2026-08-01T00:00:00.000Z'),
        idleExpiresAt: new Date('2026-07-01T00:00:00.000Z'),
        lastUsedAt: new Date('2026-06-01T00:00:00.000Z'),
        revokedAt: null,
        createdAt: new Date('2026-06-01T00:00:00.000Z'),
        updatedAt: null,
      })),
    }
    const userRepository = {
      findByName: vi.fn(async () => ({
        id: 7,
        uid: 'user-1',
        name: 'admin',
        password: hash,
        salt,
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

    jwtServiceMock.hashToken.mockResolvedValue('hashed-refresh-token-id')
    jwtServiceMock.createTokens.mockResolvedValue({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      accessTokenExpiresAt: new Date('2026-06-01T00:10:00.000Z'),
      refreshTokenExpiresAt: new Date('2026-08-01T00:00:00.000Z'),
    })

    const result = await new LoginUseCase({
      authSessionRepository: authSessionRepository as never,
      jwtService: jwtServiceMock as never,
      roleRepository: roleRepository as never,
      userRepository: userRepository as never,
    }).execute({
      username: 'admin',
      password: 'secret123',
    })

    expect(authSessionRepository.create).toHaveBeenCalledTimes(1)
    expect(jwtServiceMock.hashToken).toHaveBeenCalledTimes(1)
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
    expect(result).toEqual({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      accessTokenExpiresAt: new Date('2026-06-01T00:10:00.000Z'),
      refreshTokenExpiresAt: new Date('2026-08-01T00:00:00.000Z'),
    })
  })
})
