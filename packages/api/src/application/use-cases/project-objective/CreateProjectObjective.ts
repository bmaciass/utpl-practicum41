import { type IUseCase, NotFoundError } from '@sigep/shared'
import { ProjectObjective } from '~/domain/entities/ProjectObjective'
import type { IProjectObjectiveRepository } from '~/domain/repositories/IProjectObjectiveRepository'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateProjectObjectiveDTO,
  ProjectObjectiveResponseDTO,
} from '../../dto/project-objective'
import { ProjectObjectiveMapper } from '../../mappers/ProjectObjectiveMapper'

export interface CreateProjectObjectiveDeps {
  projectRepository: IProjectRepository
  projectObjectiveRepository: IProjectObjectiveRepository
  userRepository: IUserRepository
}

export class CreateProjectObjective
  implements IUseCase<CreateProjectObjectiveDTO, ProjectObjectiveResponseDTO>
{
  constructor(private deps: CreateProjectObjectiveDeps) {}

  async execute(
    input: CreateProjectObjectiveDTO,
    actorUid: string,
  ): Promise<ProjectObjectiveResponseDTO> {
    const [project, user] = await Promise.all([
      this.deps.projectRepository.findByUid(input.projectUid),
      this.deps.userRepository.findByUidOrThrow(actorUid),
    ])

    if (!project) {
      throw new NotFoundError('project', input.projectUid, 'uid')
    }

    const objective = ProjectObjective.create({
      name: input.name,
      status: input.status,
      projectId: project.id,
      createdBy: user.id,
    })

    await this.deps.projectObjectiveRepository.save(objective)

    return ProjectObjectiveMapper.toDTO(objective)
  }
}
