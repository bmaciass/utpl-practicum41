import { type IPublicUseCase, NotFoundError } from '@sigep/shared'
import { formatPermission } from '~/domain/entities/Permission'
import type { IAuthSessionRepository } from '~/domain/repositories/IAuthSessionRepository'
import type { IRoleRepository } from '~/domain/repositories/IRoleRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { IJWTService } from '~/domain/services/IJWTService'
import { REFRESH_SESSION_IDLE_TTL_MS } from '~/application/use-cases/auth/authSessionConfig'
import { getDefaultJWTService } from '~/infrastructure/services/JWTService'
import type {
  RefreshTokenInputDTO,
  RefreshTokenResponseDTO,
} from '../../dto/auth/RefreshTokenDTO'

export interface RefreshTokenUseCaseDeps {
  authSessionRepository: IAuthSessionRepository
  jwtService?: IJWTService
  roleRepository: IRoleRepository
  userRepository: IUserRepository
}

export class RefreshTokenUseCase
  implements IPublicUseCase<RefreshTokenInputDTO, RefreshTokenResponseDTO>
{
  constructor(private deps: RefreshTokenUseCaseDeps) {}

  async execute(input: RefreshTokenInputDTO): Promise<RefreshTokenResponseDTO> {
    // Step 1: Verify the refresh token
    const jwtService = this.deps.jwtService ?? (await getDefaultJWTService())
    const payload = await jwtService.verifyRefreshToken(input.refreshToken)

    if (!payload) {
      throw new Error('Invalid or expired refresh token')
    }

    const authSession = await this.deps.authSessionRepository.findByUid(
      payload.sessionId,
    )
    if (!authSession) {
      throw new Error('Refresh session not found')
    }

    const now = new Date()
    if (authSession.revokedAt) {
      throw new Error('Refresh session revoked')
    }
    if (authSession.expiresAt.getTime() <= now.getTime()) {
      throw new Error('Refresh session expired')
    }
    if (authSession.idleExpiresAt.getTime() <= now.getTime()) {
      throw new Error('Refresh session idle expired')
    }

    const isTokenMatch = await jwtService.compareTokenHash(
      payload.tokenId,
      authSession.tokenHash,
    )
    if (!isTokenMatch) {
      throw new Error('Refresh token rotated')
    }

    // Step 2: Fetch the user from database
    const user = await this.deps.userRepository.findById(authSession.userId)

    if (!user) {
      throw new NotFoundError('user', payload.sub, 'uid')
    }
    if (user.uid !== payload.sub) {
      throw new Error('Refresh token subject mismatch')
    }

    // Step 3: Check if user is active
    if (!user.active) {
      throw new Error('User account is deactivated')
    }

    // Step 4: Fetch current roles and permissions from database
    const roles = await this.deps.roleRepository.findByUserId(user.id)
    const permissions = roles.flatMap((role) => role.permissions)

    // Step 5: Generate new token pair with fresh claims
    const refreshTokenId = crypto.randomUUID()
    const rotatedSession = await this.deps.authSessionRepository.rotate(
      authSession.uid,
      {
        tokenHash: await jwtService.hashToken(refreshTokenId),
        idleExpiresAt: new Date(now.getTime() + REFRESH_SESSION_IDLE_TTL_MS),
        lastUsedAt: now,
      },
    )

    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await jwtService.createTokens(
      user.uid,
      {
        roles: roles.map((role) => role.name),
        permissions: permissions.map((permission) =>
          formatPermission(permission),
        ),
      },
      {
        sessionId: rotatedSession.uid,
        tokenId: refreshTokenId,
        expiresAt: rotatedSession.expiresAt,
      },
    )

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    }
  }
}
