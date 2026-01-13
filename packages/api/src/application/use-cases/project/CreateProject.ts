import { type IUseCase, NotFoundError } from '@sigep/shared'
import { Project } from '~/domain/entities/Project'
import type { IProgramRepository } from '~/domain/repositories/IProgramRepository'
import type { IProjectRepository } from '~/domain/repositories/IProjectRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type { CreateProjectDTO, ProjectResponseDTO } from '../../dto/project'
import { ProjectMapper } from '../../mappers/ProjectMapper'

export interface CreateProjectDeps {
  programRepository: IProgramRepository
  projectRepository: IProjectRepository
  userRepository: IUserRepository
}

export class CreateProject
  implements IUseCase<CreateProjectDTO, ProjectResponseDTO>
{
  constructor(private deps: CreateProjectDeps) {}

  async execute(
    input: CreateProjectDTO,
    actorId: string,
  ): Promise<ProjectResponseDTO> {
    const [program, user, actor] = await Promise.all([
      this.deps.programRepository.findByUid(input.programUid),
      this.deps.userRepository.findByUid(input.responsibleUid),
      this.deps.userRepository.findByUidOrThrow(actorId),
    ])

    if (!program) throw new NotFoundError('program', input.programUid)
    if (!user) throw new NotFoundError('user', input.responsibleUid)

    const project = Project.create({
      name: input.name,
      description: input.description,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      responsibleId: user.id,
      programId: program.id,
      createdBy: actor.id,
    })

    await this.deps.projectRepository.save(project)

    return ProjectMapper.toDTO(project)
  }
}
