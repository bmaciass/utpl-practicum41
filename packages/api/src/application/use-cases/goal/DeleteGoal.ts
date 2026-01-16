import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import type { IGoalRepository } from '~/domain/repositories/IGoalRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'

export interface DeleteGoalInput {
  uid: string
}

export interface DeleteGoalDeps {
  goalRepository: IGoalRepository
  userRepository: IUserRepository
}

export class DeleteGoal implements IUseCase<DeleteGoalInput, void> {
  constructor(private deps: DeleteGoalDeps) {}

  async execute(input: DeleteGoalInput, userUid: string): Promise<void> {
    // 1. Find goal
    const goal = await this.deps.goalRepository.findByUidOrThrow(input.uid)

    // 2. Get user for audit
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    // 3. Soft delete (deactivate)
    goal.deactivate(user.id)

    // 4. Persist
    await this.deps.goalRepository.save(goal)
  }
}
