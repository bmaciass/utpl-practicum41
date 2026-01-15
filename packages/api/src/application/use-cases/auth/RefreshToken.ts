import { type IPublicUseCase, NotFoundError } from '@sigep/shared'
import { formatPermission } from '~/domain/entities/Permission'
import type { IRoleRepository } from '~/domain/repositories/IRoleRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { getDefaultJWTService } from '~/infrastructure/services/JWTService'
import type {
  RefreshTokenInputDTO,
  RefreshTokenResponseDTO,
} from '../../dto/auth/RefreshTokenDTO'

export interface RefreshTokenUseCaseDeps {
  roleRepository: IRoleRepository
  userRepository: IUserRepository
}

export class RefreshTokenUseCase
  implements IPublicUseCase<RefreshTokenInputDTO, RefreshTokenResponseDTO>
{
  constructor(private deps: RefreshTokenUseCaseDeps) {}

  async execute(input: RefreshTokenInputDTO): Promise<RefreshTokenResponseDTO> {
    // Step 1: Verify the refresh token
    const jwtService = await getDefaultJWTService()
    const payload = await jwtService.verifyRefreshToken(input.refreshToken)

    if (!payload) {
      throw new Error('Invalid or expired refresh token')
    }

    // Step 2: Fetch the user from database
    const user = await this.deps.userRepository.findByUid(payload.sub)

    if (!user) {
      throw new NotFoundError('user', payload.sub, 'uid')
    }

    // Step 3: Check if user is active
    if (!user.active) {
      throw new Error('User account is deactivated')
    }

    // Step 4: Fetch current roles and permissions from database
    const roles = await this.deps.roleRepository.findByUserId(user.id)
    const permissions = roles.flatMap((role) => role.permissions)

    // Step 5: Generate new token pair with fresh claims
    const { accessToken, refreshToken } = await jwtService.createTokens(
      user.uid,
      {
        roles: roles.map((role) => role.name),
        permissions: permissions.map((permission) =>
          formatPermission(permission),
        ),
      },
    )

    return { accessToken, refreshToken }
  }
}
