import type { IUseCase } from '@sigep/shared'
import { NotFoundError } from '@sigep/shared'
import { Goal } from '~/domain/entities/Goal'
import type { IGoalRepository } from '~/domain/repositories/IGoalRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { CreateGoalDTO, GoalResponseDTO } from '../../dto/goal'
import { GoalApplicationMapper } from '../../mappers/GoalMapper'

export interface CreateGoalDeps {
  goalRepository: IGoalRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
  userRepository: IUserRepository
}

export class CreateGoal implements IUseCase<CreateGoalDTO, GoalResponseDTO> {
  constructor(private deps: CreateGoalDeps) {}

  async execute(input: CreateGoalDTO, userUid: string): Promise<GoalResponseDTO> {
    // 1. Find institutional objective
    const institutionalObjective =
      await this.deps.institutionalObjectiveRepository.findByUidOrThrow(
        input.institutionalObjectiveUid,
      )

    // 2. Get user for audit
    const user = await this.deps.userRepository.findByUid(userUid)
    if (!user) {
      throw new NotFoundError('user', userUid)
    }

    // 3. Create domain entity
    const goal = Goal.create({
      name: input.name,
      description: input.description,
      institutionalObjectiveId: institutionalObjective.id,
      createdBy: user.id,
    })

    // 4. Persist
    const savedGoal = await this.deps.goalRepository.save(goal)

    // 5. Return DTO
    return GoalApplicationMapper.toDTO(savedGoal)
  }
}
