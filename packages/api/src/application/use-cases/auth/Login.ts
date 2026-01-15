import { type IPublicUseCase, NotFoundError } from '@sigep/shared'
import { formatPermission } from '~/domain/entities/Permission'
import type { IRoleRepository } from '~/domain/repositories/IRoleRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { getDefaultJWTService } from '~/infrastructure/services/JWTService'
import { PasswordService } from '~/infrastructure/services/PasswordService'
import type {
  LoginUseCaseInputDTO,
  LoginUseCaseResponseDTO,
} from '../../dto/auth/LoginDTO'

export interface LoginUseCaseDeps {
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

    const session = await getDefaultJWTService()
    const { accessToken, refreshToken } = await session.createTokens(user.uid, {
      roles: roles.map((role) => role.name),
      permissions: permissions.map((permission) =>
        formatPermission(permission),
      ),
    })

    return { accessToken, refreshToken }
  }
}
