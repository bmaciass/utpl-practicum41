import type { IUseCase } from '@sigep/shared'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  InstitutionResponseDTO,
  UpdateInstitutionDTO,
} from '../../dto/institution'
import { InstitutionMapper } from '../../mappers/InstitutionMapper'

export interface UpdateInstitutionInput {
  uid: string
  data: UpdateInstitutionDTO
}

export interface UpdateInstitutionDeps {
  institutionRepository: IInstitutionRepository
  userRepository: IUserRepository
}

export class UpdateInstitution
  implements IUseCase<UpdateInstitutionInput, InstitutionResponseDTO>
{
  constructor(private deps: UpdateInstitutionDeps) {}

  async execute(
    input: UpdateInstitutionInput,
    userUid: string,
  ): Promise<InstitutionResponseDTO> {
    const [institution, user] = await Promise.all([
      this.deps.institutionRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])

    const updatedBy = user.id

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
