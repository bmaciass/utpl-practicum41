import type { IUseCase } from '@sigep/shared'
import { Institution } from '~/domain/entities/Institution'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  CreateInstitutionDTO,
  InstitutionResponseDTO,
} from '../../dto/institution'
import { InstitutionMapper } from '../../mappers/InstitutionMapper'

export interface CreateInstitutionDeps {
  institutionRepository: IInstitutionRepository
  userRepository: IUserRepository
}

export class CreateInstitution
  implements IUseCase<CreateInstitutionDTO, InstitutionResponseDTO>
{
  constructor(private deps: CreateInstitutionDeps) {}

  async execute(
    input: CreateInstitutionDTO,
    userUid: string,
  ): Promise<InstitutionResponseDTO> {
    const user = await this.deps.userRepository.findByUidOrThrow(userUid)
    const institution = Institution.create({
      name: input.name,
      area: input.area,
      level: input.level,
      createdBy: user.id,
    })

    await this.deps.institutionRepository.save(institution)

    return InstitutionMapper.toDTO(institution)
  }
}
