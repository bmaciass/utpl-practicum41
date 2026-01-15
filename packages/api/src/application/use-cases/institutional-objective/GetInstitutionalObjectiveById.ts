import type { IUseCase } from '@sigep/shared'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { InstitutionalObjectiveResponseDTO } from '../../dto/institutional-objective'
import { InstitutionalObjectiveMapper } from '../../mappers/InstitutionalObjectiveMapper'

export interface GetInstitutionalObjectiveByIdDeps {
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
}

export class GetInstitutionalObjectiveById
  implements IUseCase<string, InstitutionalObjectiveResponseDTO>
{
  constructor(private deps: GetInstitutionalObjectiveByIdDeps) {}

  async execute(uid: string): Promise<InstitutionalObjectiveResponseDTO> {
    const objective =
      await this.deps.institutionalObjectiveRepository.findByUidOrThrow(uid)

    return InstitutionalObjectiveMapper.toDTO(objective)
  }
}
