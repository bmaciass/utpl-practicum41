import type { IUseCase } from '@sigep/shared'
import { isUndefined } from 'lodash-es'
import type { IProjectTaskRepository } from '~/domain/repositories/IProjectTaskRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  ProjectTaskResponseDTO,
  UpdateProjectTaskDTO,
} from '../../dto/project-task'
import { ProjectTaskMapper } from '../../mappers/ProjectTaskMapper'

export interface UpdateProjectTaskInput {
  uid: string
  data: UpdateProjectTaskDTO
}

export interface UpdateProjectTaskDeps {
  projectTaskRepository: IProjectTaskRepository
  userRepository: IUserRepository
}

export class UpdateProjectTask
  implements IUseCase<UpdateProjectTaskInput, ProjectTaskResponseDTO>
{
  constructor(private deps: UpdateProjectTaskDeps) {}

  async execute(
    input: UpdateProjectTaskInput,
    userUid: string,
  ): Promise<ProjectTaskResponseDTO> {
    const [task, user] = await Promise.all([
      this.deps.projectTaskRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])
    const updatedBy = user.id

    if (input.data.name !== undefined) {
      task.updateName(input.data.name, updatedBy)
    }
    if (input.data.status !== undefined) {
      task.updateStatus(input.data.status, updatedBy)
    }
    if (!isUndefined(input.data.description)) {
      task.updateDescription(input.data.description, updatedBy)
    }
    if (!isUndefined(input.data.responsibleUid)) {
      const user = await this.deps.userRepository.findByUidOrThrow(
        input.data.responsibleUid,
      )
      task.updateResponsibleId(user.id, updatedBy)
    }
    if (
      input.data.startDate !== undefined ||
      input.data.endDate !== undefined
    ) {
      task.updateDates(
        {
          startDate: input.data.startDate,
          endDate: input.data.endDate,
        },
        updatedBy,
      )
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        task.activate(updatedBy)
      } else {
        task.deactivate(updatedBy)
      }
    }

    await this.deps.projectTaskRepository.save(task)

    return ProjectTaskMapper.toDTO(task)
  }
}
