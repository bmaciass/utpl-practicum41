import type { IUseCase } from '@sigep/shared'
import { Institution } from '~/domain/entities/Institution'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type {
  CreateInstitutionDTO,
  InstitutionResponseDTO,
} from '../../dto/institution'
import { InstitutionMapper } from '../../mappers/InstitutionMapper'

export interface CreateInstitutionDeps {
  institutionRepository: IInstitutionRepository
}

export class CreateInstitution
  implements IUseCase<CreateInstitutionDTO, InstitutionResponseDTO>
{
  constructor(private deps: CreateInstitutionDeps) {}

  async execute(
    input: CreateInstitutionDTO,
    actorId: string,
  ): Promise<InstitutionResponseDTO> {
    const institution = Institution.create({
      name: input.name,
      area: input.area,
      level: input.level,
      createdBy: Number(actorId),
    })

    await this.deps.institutionRepository.save(institution)

    return InstitutionMapper.toDTO(institution)
  }
}
