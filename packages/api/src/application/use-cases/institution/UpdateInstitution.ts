import type { IUseCase } from '@sigep/shared'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type {
  UpdateInstitutionDTO,
  InstitutionResponseDTO,
} from '../../dto/institution'
import { InstitutionMapper } from '../../mappers/InstitutionMapper'

export interface UpdateInstitutionInput {
  uid: string
  data: UpdateInstitutionDTO
}

export interface UpdateInstitutionDeps {
  institutionRepository: IInstitutionRepository
}

export class UpdateInstitution
  implements IUseCase<UpdateInstitutionInput, InstitutionResponseDTO>
{
  constructor(private deps: UpdateInstitutionDeps) {}

  async execute(
    input: UpdateInstitutionInput,
    actorId: string,
  ): Promise<InstitutionResponseDTO> {
    const institution = await this.deps.institutionRepository.findByUidOrThrow(
      input.uid,
    )

    const updatedBy = Number(actorId)

    if (input.data.name !== undefined) {
      institution.updateName(input.data.name, updatedBy)
    }

    if (input.data.area !== undefined) {
      institution.updateArea(input.data.area, updatedBy)
    }

    if (input.data.level !== undefined) {
      institution.updateLevel(input.data.level, updatedBy)
    }

    if (input.data.active !== undefined) {
      if (input.data.active) {
        institution.activate(updatedBy)
      } else {
        institution.deactivate(updatedBy)
      }
    }

    await this.deps.institutionRepository.save(institution)

    return InstitutionMapper.toDTO(institution)
  }
}
