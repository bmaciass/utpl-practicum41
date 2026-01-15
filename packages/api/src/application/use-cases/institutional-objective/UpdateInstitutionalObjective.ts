import { type IUseCase, NotFoundError } from '@sigep/shared'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  InstitutionalObjectiveResponseDTO,
  UpdateInstitutionalObjectiveDTO,
} from '../../dto/institutional-objective'
import { InstitutionalObjectiveMapper } from '../../mappers/InstitutionalObjectiveMapper'

export interface UpdateInstitutionalObjectiveInput {
  uid: string
  data: UpdateInstitutionalObjectiveDTO
}

export interface UpdateInstitutionalObjectiveDeps {
  institutionRepository: IInstitutionRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
  userRepository: IUserRepository
}

export class UpdateInstitutionalObjective
  implements
    IUseCase<
      UpdateInstitutionalObjectiveInput,
      InstitutionalObjectiveResponseDTO
    >
{
  constructor(private deps: UpdateInstitutionalObjectiveDeps) {}

  async execute(
    input: UpdateInstitutionalObjectiveInput,
    userUid: string,
  ): Promise<InstitutionalObjectiveResponseDTO> {
    const [objective, user] = await Promise.all([
      this.deps.institutionalObjectiveRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])
    const updatedBy = user.id

    if (input.data.name !== undefined) {
      objective.updateName(input.data.name, updatedBy)
    }
    if (input.data.description !== undefined) {
      objective.updateDescription(input.data.description ?? null, updatedBy)
    }
    if (input.data.institutionUid !== undefined) {
      const institution = await this.deps.institutionRepository.findByUid(
        input.data.institutionUid,
      )
      if (!institution) {
        throw new NotFoundError('institution', input.data.institutionUid)
      }
      objective.updateInstitution(institution.id, updatedBy)
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        objective.activate(updatedBy)
      } else {
        objective.deactivate(updatedBy)
      }
    }

    await this.deps.institutionalObjectiveRepository.save(objective)

    return InstitutionalObjectiveMapper.toDTO(objective)
  }
}
