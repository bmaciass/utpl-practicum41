import type { IUseCase } from '@sigep/shared'
import type {
  FindManyGoalsOptions,
  IGoalRepository,
} from '~/domain/repositories/IGoalRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { GoalResponseDTO } from '../../dto/goal'
import { GoalApplicationMapper } from '../../mappers/GoalMapper'

export interface ListGoalsInput {
  options?: FindManyGoalsOptions
}

export interface ListGoalsDeps {
  goalRepository: IGoalRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
}

export class ListGoals implements IUseCase<ListGoalsInput, GoalResponseDTO[]> {
  constructor(private deps: ListGoalsDeps) {}

  async execute(input: ListGoalsInput): Promise<GoalResponseDTO[]> {
    const goals = await this.deps.goalRepository.findMany(input.options)
    return goals.map(GoalApplicationMapper.toDTO)
  }
}
