import { type IUseCase, NotFoundError } from '@sigep/shared'
import { InstitutionalObjective } from '~/domain/entities/InstitutionalObjective'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateInstitutionalObjectiveDTO,
  InstitutionalObjectiveResponseDTO,
} from '../../dto/institutional-objective'
import { InstitutionalObjectiveMapper } from '../../mappers/InstitutionalObjectiveMapper'

export interface CreateInstitutionalObjectiveDeps {
  institutionRepository: IInstitutionRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
  userRepository: IUserRepository
}

export class CreateInstitutionalObjective
  implements
    IUseCase<CreateInstitutionalObjectiveDTO, InstitutionalObjectiveResponseDTO>
{
  constructor(private deps: CreateInstitutionalObjectiveDeps) {}

  async execute(
    input: CreateInstitutionalObjectiveDTO,
    userUid: string,
  ): Promise<InstitutionalObjectiveResponseDTO> {
    const [institution, user] = await Promise.all([
      this.deps.institutionRepository.findByUid(input.institutionUid),
      this.deps.userRepository.findByUid(userUid),
    ])

    if (!institution)
      throw new NotFoundError('institution', input.institutionUid)
    if (!user) throw new NotFoundError('user', userUid)

    const objective = InstitutionalObjective.create({
      name: input.name,
      description: input.description,
      institutionId: institution.id,
      createdBy: user.id,
    })

    await this.deps.institutionalObjectiveRepository.save(objective)

    return InstitutionalObjectiveMapper.toDTO(objective)
  }
}
