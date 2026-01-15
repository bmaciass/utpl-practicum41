import { type IUseCase, NotFoundError } from '@sigep/shared'
import { ProjectTask } from '~/domain/entities/ProjectTask'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { IProjectTaskRepository } from '~/domain/repositories/IProjectTaskRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateProjectTaskDTO,
  ProjectTaskResponseDTO,
} from '../../dto/project-task'
import { ProjectTaskMapper } from '../../mappers/ProjectTaskMapper'

export interface CreateProjectGoalDeps {
  projectRepository: IProjectRepository
  projectTaskRepository: IProjectTaskRepository
  userRepository: IUserRepository
}

export class CreateProjectGoal
  implements IUseCase<CreateProjectTaskDTO, ProjectTaskResponseDTO>
{
  constructor(private deps: CreateProjectGoalDeps) {}

  async execute(
    input: CreateProjectTaskDTO,
    actorId: string,
  ): Promise<ProjectTaskResponseDTO> {
    const [project, user, responsible] = await Promise.all([
      this.deps.projectRepository.findByUid(input.projectUid),
      this.deps.userRepository.findByUidOrThrow(actorId),
      this.deps.userRepository.findByUid(input.responsibleUid),
    ])
    if (!project) throw new NotFoundError('project', `${input.projectUid}`)
    if (!responsible) throw new NotFoundError('user', `${input.responsibleUid}`)

    const goal = ProjectTask.create({
      name: input.name,
      description: input.description,
      projectId: project.id,
      responsibleId: responsible.id,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      createdBy: user.id,
    })

    await this.deps.projectTaskRepository.save(goal)

    return ProjectTaskMapper.toDTO(goal)
  }
}
