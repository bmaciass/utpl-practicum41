import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { InstitutionResponseDTO } from '../../dto/institution'
import { InstitutionMapper } from '../../mappers/InstitutionMapper'

export interface GetInstitutionByIdDeps {
  institutionRepository: IInstitutionRepository
}

export class GetInstitutionById {
  constructor(private deps: GetInstitutionByIdDeps) {}

  async execute(uid: string): Promise<InstitutionResponseDTO | null> {
    const institution = await this.deps.institutionRepository.findByUid(uid)

    if (!institution) {
      return null
    }

    return InstitutionMapper.toDTO(institution)
  }
}
