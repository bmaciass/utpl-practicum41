import type { IUseCase } from '@sigep/shared'
import type { IProjectGoalRepository } from '~/domain/repositories/IProjectGoalRepository'
import type { ProjectGoalResponseDTO } from '../../dto/project-goal'
import { ProjectGoalMapper } from '../../mappers/ProjectGoalMapper'

export interface GetProjectGoalByIdDeps {
  projectGoalRepository: IProjectGoalRepository
}

export class GetProjectGoalById
  implements IUseCase<string, ProjectGoalResponseDTO | null>
{
  constructor(private deps: GetProjectGoalByIdDeps) {}

  async execute(uid: string): Promise<ProjectGoalResponseDTO | null> {
    const goal = await this.deps.projectGoalRepository.findByUid(uid)
    return goal ? ProjectGoalMapper.toDTO(goal) : null
  }
}
