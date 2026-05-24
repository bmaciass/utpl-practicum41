import { type IPublicUseCase, NotFoundError } from '@sigep/shared'
import {
  REFRESH_SESSION_ABSOLUTE_TTL_MS,
  REFRESH_SESSION_IDLE_TTL_MS,
} from '~/application/use-cases/auth/authSessionConfig'
import { formatPermission } from '~/domain/entities/Permission'
import type { IAuthSessionRepository } from '~/domain/repositories/IAuthSessionRepository'
import type { IRoleRepository } from '~/domain/repositories/IRoleRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { IJWTService } from '~/domain/services/IJWTService'
import { getDefaultJWTService } from '~/infrastructure/services/JWTService'
import { PasswordService } from '~/infrastructure/services/PasswordService'
import type {
  LoginUseCaseInputDTO,
  LoginUseCaseResponseDTO,
} from '../../dto/auth/LoginDTO'

export interface LoginUseCaseDeps {
  authSessionRepository: IAuthSessionRepository
  jwtService?: IJWTService
  roleRepository: IRoleRepository
  userRepository: IUserRepository
}

export class LoginUseCase
  implements IPublicUseCase<LoginUseCaseInputDTO, LoginUseCaseResponseDTO>
{
  constructor(private deps: LoginUseCaseDeps) {}
  async execute(input: LoginUseCaseInputDTO): Promise<LoginUseCaseResponseDTO> {
    const user = await this.deps.userRepository.findByName(input.username)
    if (!user) throw new NotFoundError('user', input.username, 'name')

    const passManager = new PasswordService()
    const isValid = passManager.verifyPassword(
      input.password,
      user.password,
      user.salt,
    )
    if (!isValid) throw new Error('username or password incorrect')

    const roles = await this.deps.roleRepository.findByUserId(user.id)
    const permissions = roles.flatMap((role) => role.permissions)

    const session = this.deps.jwtService ?? (await getDefaultJWTService())
    const now = new Date()
    const refreshTokenId = crypto.randomUUID()
    const authSession = await this.deps.authSessionRepository.create({
      userId: user.id,
      tokenHash: await session.hashToken(refreshTokenId),
      expiresAt: new Date(now.getTime() + REFRESH_SESSION_ABSOLUTE_TTL_MS),
      idleExpiresAt: new Date(now.getTime() + REFRESH_SESSION_IDLE_TTL_MS),
      lastUsedAt: now,
    })

    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await session.createTokens(
      user.uid,
      {
        roles: roles.map((role) => role.name),
        permissions: permissions.map((permission) =>
          formatPermission(permission),
        ),
      },
      {
        sessionId: authSession.uid,
        tokenId: refreshTokenId,
        expiresAt: authSession.expiresAt,
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
