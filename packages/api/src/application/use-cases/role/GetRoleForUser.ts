import type { IPublicUseCase } from '@sigep/shared'
import type { GetRoleForUserDTO } from '~/application/dto/role/GetRoleForUserDTO'
import type { IRoleRepository } from '~/domain/repositories/IRoleRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'

export interface GetRoleForUserDeps {
  roleRepository: IRoleRepository
  userRepository: IUserRepository
}

export class GetRoleForUserUseCase
  implements IPublicUseCase<string, GetRoleForUserDTO>
{
  constructor(private deps: GetRoleForUserDeps) {}

  async execute(userUid: string): Promise<GetRoleForUserDTO> {
    const user = await this.deps.userRepository.findByUidOrThrow(userUid)

    const roles = await this.deps.roleRepository.findByUserId(user.id)

    return { roles }
  }
}
