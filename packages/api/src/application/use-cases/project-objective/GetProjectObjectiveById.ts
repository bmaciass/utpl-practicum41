import type { IUseCase } from '@sigep/shared'
import type { IProjectObjectiveRepository } from '~/domain/repositories/IProjectObjectiveRepository'
import type { ProjectObjectiveResponseDTO } from '../../dto/project-objective'
import { ProjectObjectiveMapper } from '../../mappers/ProjectObjectiveMapper'

export interface GetProjectObjectiveByIdDeps {
  projectObjectiveRepository: IProjectObjectiveRepository
}

export class GetProjectObjectiveById
  implements IUseCase<string, ProjectObjectiveResponseDTO | null>
{
  constructor(private deps: GetProjectObjectiveByIdDeps) {}

  async execute(uid: string): Promise<ProjectObjectiveResponseDTO | null> {
    const objective = await this.deps.projectObjectiveRepository.findByUid(uid)
    return objective ? ProjectObjectiveMapper.toDTO(objective) : null
  }
}
