import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'

export interface DeleteObjectivePNDInput {
  uid: string
}

export interface DeleteObjectivePNDDeps {
  objectivePNDRepository: IObjectivePNDRepository
  userRepository: IUserRepository
}

export class DeleteObjectivePND
  implements IUseCase<DeleteObjectivePNDInput, void>
{
  constructor(private deps: DeleteObjectivePNDDeps) {}

  async execute(
    input: DeleteObjectivePNDInput,
    userUid: string,
  ): Promise<void> {
    // 1. Find objective
    const objective = await this.deps.objectivePNDRepository.findByUidOrThrow(
      input.uid,
    )

    // 2. Get user for audit
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    // 3. Soft delete (deactivate)
    objective.deactivate(user.id)

    // 4. Persist
    await this.deps.objectivePNDRepository.save(objective)
  }
}
