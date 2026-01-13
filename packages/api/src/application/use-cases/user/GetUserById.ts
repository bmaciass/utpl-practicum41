import type { IUseCase } from '@sigep/shared'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { UserResponseDTO } from '../../dto/user'
import { UserMapper } from '../../mappers/UserMapper'

export interface GetUserByIdDeps {
  userRepository: IUserRepository
}

export class GetUserById implements IUseCase<string, UserResponseDTO | null> {
  constructor(private deps: GetUserByIdDeps) {}

  async execute(uid: string): Promise<UserResponseDTO | null> {
    const user = await this.deps.userRepository.findByUid(uid)
    if (!user) {
      return null
    }
    return UserMapper.toDTO(user)
  }
}
