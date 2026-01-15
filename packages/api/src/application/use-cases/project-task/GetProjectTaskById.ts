import type { IUseCase } from '@sigep/shared'
import type { IProjectTaskRepository } from '~/domain/repositories/IProjectTaskRepository'
import type { ProjectTaskResponseDTO } from '../../dto/project-task'
import { ProjectTaskMapper } from '../../mappers/ProjectTaskMapper'

export interface GetProjectTaskByIdDeps {
  projectTaskRepository: IProjectTaskRepository
}

export class GetProjectTaskById
  implements IUseCase<string, ProjectTaskResponseDTO | null>
{
  constructor(private deps: GetProjectTaskByIdDeps) {}

  async execute(uid: string): Promise<ProjectTaskResponseDTO | null> {
    const task = await this.deps.projectTaskRepository.findByUid(uid)
    return task ? ProjectTaskMapper.toDTO(task) : null
  }
}
