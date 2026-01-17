import type { IUseCase } from '@sigep/shared'
import type { IGoalRepository } from '~/domain/repositories/IGoalRepository'
import type { GoalResponseDTO } from '../../dto/goal'
import { GoalApplicationMapper } from '../../mappers/GoalMapper'

export interface GetGoalByUidInput {
  uid: string
}

export interface GetGoalByUidDeps {
  goalRepository: IGoalRepository
}

export class GetGoalById
  implements IUseCase<GetGoalByUidInput, GoalResponseDTO>
{
  constructor(private deps: GetGoalByUidDeps) {}

  async execute(input: GetGoalByUidInput): Promise<GoalResponseDTO> {
    const goal = await this.deps.goalRepository.findByUidOrThrow(input.uid)

    // 3. Return DTO
    return GoalApplicationMapper.toDTO(goal)
  }
}
