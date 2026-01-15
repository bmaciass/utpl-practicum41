import { type IUseCase, NotFoundError } from '@sigep/shared'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type {
  IProjectTaskRepository,
  ProjectTaskFilters,
} from '~/domain/repositories/IProjectTaskRepository'
import type { ProjectTaskResponseDTO } from '../../dto/project-task'
import { ProjectTaskMapper } from '../../mappers/ProjectTaskMapper'

export interface ListProjectTasksInput {
  projectUid: string
  where?: ProjectTaskFilters
  pagination?: {
    offset?: number
    limit?: number
  }
}

export interface ListProjectTasksDeps {
  projectRepository: IProjectRepository
  projectTaskRepository: IProjectTaskRepository
}

export class ListProjectTasks
  implements IUseCase<ListProjectTasksInput, ProjectTaskResponseDTO[]>
{
  constructor(private deps: ListProjectTasksDeps) {}

  async execute(
    input: ListProjectTasksInput,
  ): Promise<ProjectTaskResponseDTO[]> {
    const { projectUid, pagination, where: filters } = input

    const project = await this.deps.projectRepository.findByUid(projectUid)
    if (!project) throw new NotFoundError('project', projectUid, 'uid')

    const where = {
      projectId: project.id,
      ...filters,
    } satisfies ProjectTaskFilters
    const goals = await this.deps.projectTaskRepository.findMany({
      where,
      pagination,
    })

    return ProjectTaskMapper.toDTOList(goals)
  }
}
