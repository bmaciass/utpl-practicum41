import type { IUseCase } from '@sigep/shared'
import type {
  IProjectGoalRepository,
  ProjectGoalFilters,
} from '~/domain/repositories/IProjectGoalRepository'
import type { ProjectGoalResponseDTO } from '../../dto/project-goal'
import { ProjectGoalMapper } from '../../mappers/ProjectGoalMapper'

export interface ListProjectGoalsInput {
  projectUid: string
  where?: ProjectGoalFilters
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListProjectGoalsDeps {
  projectGoalRepository: IProjectGoalRepository
}

export class ListProjectGoals
  implements IUseCase<ListProjectGoalsInput, ProjectGoalResponseDTO[]>
{
  constructor(private deps: ListProjectGoalsDeps) {}

  async execute(
    input: ListProjectGoalsInput,
  ): Promise<ProjectGoalResponseDTO[]> {
    const goals = await this.deps.projectGoalRepository.findMany({
      where: input.where,
      pagination: input.pagination,
    })

    return ProjectGoalMapper.toDTOList(goals)
  }
}
