import type { IUseCase } from '@sigep/shared'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { ProjectResponseDTO } from '../../dto/project'
import { ProjectMapper } from '../../mappers/ProjectMapper'

export interface GetProjectByIdDeps {
  projectRepository: IProjectRepository
}

export class GetProjectById
  implements IUseCase<string, ProjectResponseDTO | null>
{
  constructor(private deps: GetProjectByIdDeps) {}

  async execute(uid: string): Promise<ProjectResponseDTO | null> {
    const project = await this.deps.projectRepository.findByUid(uid)
    return project ? ProjectMapper.toDTO(project) : null
  }
}
