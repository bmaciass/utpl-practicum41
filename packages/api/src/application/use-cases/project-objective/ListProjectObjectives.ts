import { type IUseCase, NotFoundError } from '@sigep/shared'
import type {
  IProjectObjectiveRepository,
  ProjectObjectiveFilters,
} from '~/domain/repositories/IProjectObjectiveRepository'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { ProjectObjectiveResponseDTO } from '../../dto/project-objective'
import { ProjectObjectiveMapper } from '../../mappers/ProjectObjectiveMapper'

export interface ListProjectObjectivesInput {
  projectUid: string
  where?: ProjectObjectiveFilters
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListProjectObjectivesDeps {
  projectRepository: IProjectRepository
  projectObjectiveRepository: IProjectObjectiveRepository
}

export class ListProjectObjectives
  implements IUseCase<ListProjectObjectivesInput, ProjectObjectiveResponseDTO[]>
{
  constructor(private deps: ListProjectObjectivesDeps) {}

  async execute(
    input: ListProjectObjectivesInput,
  ): Promise<ProjectObjectiveResponseDTO[]> {
    const { projectUid, pagination, where } = input
    const project = await this.deps.projectRepository.findByUid(projectUid)
    if (!project) throw new NotFoundError('project', projectUid, 'uid')

    const records = await this.deps.projectObjectiveRepository.findMany({
      where: {
        projectId: project.id,
        active: where?.active,
        status: where?.status,
      },
      pagination,
    })

    return ProjectObjectiveMapper.toDTOList(records)
  }
}
