import type { IUseCase } from '@sigep/shared'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { ProjectResponseDTO, UpdateProjectDTO } from '../../dto/project'
import { ProjectMapper } from '../../mappers/ProjectMapper'

export interface UpdateProjectInput {
  uid: string
  data: UpdateProjectDTO
}

export interface UpdateProjectDeps {
  projectRepository: IProjectRepository
  userRepository: IUserRepository
}

export class UpdateProject
  implements IUseCase<UpdateProjectInput, ProjectResponseDTO>
{
  constructor(private deps: UpdateProjectDeps) {}

  async execute(
    input: UpdateProjectInput,
    actorId: string,
  ): Promise<ProjectResponseDTO> {
    const project = await this.deps.projectRepository.findByUidOrThrow(
      input.uid,
    )
    const updatedBy = Number(actorId)

    if (input.data.name !== undefined) {
      project.updateName(input.data.name, updatedBy)
    }
    if (input.data.description !== undefined) {
      project.updateDescription({
        description: input.data.description,
        updatedBy,
      })
    }
    if (input.data.status !== undefined) {
      project.updateStatus(input.data.status, updatedBy)
    }
    if (
      input.data.startDate !== undefined ||
      input.data.endDate !== undefined
    ) {
      project.updateDates(
        {
          startDate: input.data.startDate,
          endDate: input.data.endDate,
        },
        updatedBy,
      )
    }
    if (input.data.responsibleUid !== undefined) {
      const user = await this.deps.userRepository.findByUidOrThrow(
        input.data.responsibleUid,
      )
      project.updateResponsible(user.id, updatedBy)
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        project.activate(updatedBy)
      } else {
        project.deactivate(updatedBy)
      }
    }

    await this.deps.projectRepository.save(project)

    return ProjectMapper.toDTO(project)
  }
}
