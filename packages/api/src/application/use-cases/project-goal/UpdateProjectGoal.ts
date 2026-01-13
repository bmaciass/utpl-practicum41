import type { IUseCase } from '@sigep/shared'
import type { IProjectGoalRepository } from '~/domain/repositories/IProjectGoalRepository'
import type {
  ProjectGoalResponseDTO,
  UpdateProjectGoalDTO,
} from '../../dto/project-goal'
import { ProjectGoalMapper } from '../../mappers/ProjectGoalMapper'

export interface UpdateProjectGoalInput {
  uid: string
  data: UpdateProjectGoalDTO
}

export interface UpdateProjectGoalDeps {
  projectGoalRepository: IProjectGoalRepository
}

export class UpdateProjectGoal
  implements IUseCase<UpdateProjectGoalInput, ProjectGoalResponseDTO>
{
  constructor(private deps: UpdateProjectGoalDeps) {}

  async execute(
    input: UpdateProjectGoalInput,
    actorId: string,
  ): Promise<ProjectGoalResponseDTO> {
    const goal = await this.deps.projectGoalRepository.findByUidOrThrow(
      input.uid,
    )
    const updatedBy = Number(actorId)

    if (input.data.name !== undefined) {
      goal.updateName(input.data.name, updatedBy)
    }
    if (input.data.status !== undefined) {
      goal.updateStatus(input.data.status, updatedBy)
    }
    if (
      input.data.startDate !== undefined ||
      input.data.endDate !== undefined
    ) {
      goal.updateDates(
        {
          startDate: input.data.startDate,
          endDate: input.data.endDate,
        },
        updatedBy,
      )
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        goal.activate(updatedBy)
      } else {
        goal.deactivate(updatedBy)
      }
    }

    await this.deps.projectGoalRepository.save(goal)

    return ProjectGoalMapper.toDTO(goal)
  }
}
