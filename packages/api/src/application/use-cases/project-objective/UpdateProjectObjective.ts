import type { IUseCase } from '@sigep/shared'
import type { IProjectObjectiveRepository } from '~/domain/repositories/IProjectObjectiveRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  ProjectObjectiveResponseDTO,
  UpdateProjectObjectiveDTO,
} from '../../dto/project-objective'
import { ProjectObjectiveMapper } from '../../mappers/ProjectObjectiveMapper'

export interface UpdateProjectObjectiveInput {
  uid: string
  data: UpdateProjectObjectiveDTO
}

export interface UpdateProjectObjectiveDeps {
  projectObjectiveRepository: IProjectObjectiveRepository
  userRepository: IUserRepository
}

export class UpdateProjectObjective
  implements IUseCase<UpdateProjectObjectiveInput, ProjectObjectiveResponseDTO>
{
  constructor(private deps: UpdateProjectObjectiveDeps) {}

  async execute(
    input: UpdateProjectObjectiveInput,
    userUid: string,
  ): Promise<ProjectObjectiveResponseDTO> {
    const [objective, user] = await Promise.all([
      this.deps.projectObjectiveRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])
    const updatedBy = user.id

    if (input.data.name !== undefined) {
      objective.updateName(input.data.name, updatedBy)
    }
    if (input.data.status !== undefined) {
      objective.updateStatus(input.data.status, updatedBy)
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        objective.activate(updatedBy)
      } else {
        objective.deactivate(updatedBy)
      }
    }

    await this.deps.projectObjectiveRepository.save(objective)

    return ProjectObjectiveMapper.toDTO(objective)
  }
}
