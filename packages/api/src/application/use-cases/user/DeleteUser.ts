import type { IUseCase } from '@sigep/shared'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { DeleteUserDTO } from '../../dto/user'

export interface DeleteUserDeps {
  userRepository: IUserRepository
}

/**
 * Soft deletes a user (marks deletedAt) without touching the linked person.
 */
export class DeleteUser implements IUseCase<DeleteUserDTO, void> {
  constructor(private deps: DeleteUserDeps) {}

  async execute(input: DeleteUserDTO, _actorUid: string): Promise<void> {
    const user = await this.deps.userRepository.findByUidOrThrow(input.uid)
    if (user.active) {
      user.deactivate()
      await this.deps.userRepository.save(user)
    }
  }
}
