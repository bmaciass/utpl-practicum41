import { type IUseCase, NotFoundError } from '@sigep/shared'
import { ProjectGoal } from '~/domain/entities/ProjectGoal'
import type { IProjectGoalRepository } from '~/domain/repositories/IProjectGoalRepository'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateProjectGoalDTO,
  ProjectGoalResponseDTO,
} from '../../dto/project-goal'
import { ProjectGoalMapper } from '../../mappers/ProjectGoalMapper'

export interface CreateProjectGoalDeps {
  projectRepository: IProjectRepository
  projectGoalRepository: IProjectGoalRepository
  userRepository: IUserRepository
}

export class CreateProjectGoal
  implements IUseCase<CreateProjectGoalDTO, ProjectGoalResponseDTO>
{
  constructor(private deps: CreateProjectGoalDeps) {}

  async execute(
    input: CreateProjectGoalDTO,
    actorId: string,
  ): Promise<ProjectGoalResponseDTO> {
    const [project, user] = await Promise.all([
      this.deps.projectRepository.findByUid(input.projectUid),
      this.deps.userRepository.findByUidOrThrow(actorId),
    ])
    if (!project) throw new NotFoundError('project', `${input.projectUid}`)

    const goal = ProjectGoal.create({
      name: input.name,
      projectId: project.id,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      createdBy: user.id,
    })

    await this.deps.projectGoalRepository.save(goal)

    return ProjectGoalMapper.toDTO(goal)
  }
}
