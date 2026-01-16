import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import type { IGoalRepository } from '~/domain/repositories/IGoalRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { GoalResponseDTO, UpdateGoalDTO } from '../../dto/goal'
import { GoalApplicationMapper } from '../../mappers/GoalMapper'

export interface UpdateGoalInput {
  uid: string
  data: UpdateGoalDTO
}

export interface UpdateGoalDeps {
  goalRepository: IGoalRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
  userRepository: IUserRepository
}

export class UpdateGoal implements IUseCase<UpdateGoalInput, GoalResponseDTO> {
  constructor(private deps: UpdateGoalDeps) {}

  async execute(input: UpdateGoalInput, userUid: string): Promise<GoalResponseDTO> {
    // 1. Find goal
    const goal = await this.deps.goalRepository.findByUidOrThrow(input.uid)

    // 2. Get user for audit
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    // 3. Update fields
    if (input.data.name !== undefined) {
      goal.updateName(input.data.name, user.id)
    }

    if (input.data.description !== undefined) {
      goal.updateDescription(input.data.description, user.id)
    }

    if (input.data.institutionalObjectiveUid !== undefined) {
      const institutionalObjective =
        await this.deps.institutionalObjectiveRepository.findByUidOrThrow(
          input.data.institutionalObjectiveUid,
        )
      goal.updateInstitutionalObjective(institutionalObjective.id, user.id)
    }

    if (input.data.active === false && goal.active) {
      goal.deactivate(user.id)
    }

    // 4. Persist
    const savedGoal = await this.deps.goalRepository.save(goal)

    // 6. Return DTO
    return GoalApplicationMapper.toDTO(savedGoal)
  }
}
