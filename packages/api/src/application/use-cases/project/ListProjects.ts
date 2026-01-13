import type { IUseCase } from '@sigep/shared'
import type {
  IProjectRepository,
  ProjectFilters,
} from '~/domain/repositories/IProjectRepository'
import type { ProjectResponseDTO } from '../../dto/project'
import { ProjectMapper } from '../../mappers/ProjectMapper'

export interface ListProjectsInput {
  where?: ProjectFilters
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListProjectsDeps {
  projectRepository: IProjectRepository
}

export class ListProjects
  implements IUseCase<ListProjectsInput, ProjectResponseDTO[]>
{
  constructor(private deps: ListProjectsDeps) {}

  async execute(input: ListProjectsInput): Promise<ProjectResponseDTO[]> {
    const projects = await this.deps.projectRepository.findMany({
      where: input.where,
      pagination: input.pagination,
    })

    return ProjectMapper.toDTOList(projects)
  }
}
