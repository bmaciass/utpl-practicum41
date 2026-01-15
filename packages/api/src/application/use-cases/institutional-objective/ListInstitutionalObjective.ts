import type { IUseCase } from '@sigep/shared'
import type {
  FindManyInstitutionalObjectivesOptions,
  IInstitutionalObjectiveRepository,
} from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { InstitutionalObjectiveResponseDTO } from '../../dto/institutional-objective'
import { InstitutionalObjectiveMapper } from '../../mappers/InstitutionalObjectiveMapper'

export interface ListInstitutionalObjectiveDeps {
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
}

export class ListInstitutionalObjective
  implements
    IUseCase<
      FindManyInstitutionalObjectivesOptions,
      InstitutionalObjectiveResponseDTO[]
    >
{
  constructor(private deps: ListInstitutionalObjectiveDeps) {}

  async execute(
    input: FindManyInstitutionalObjectivesOptions,
  ): Promise<InstitutionalObjectiveResponseDTO[]> {
    const objectives =
      await this.deps.institutionalObjectiveRepository.findMany(input)

    return InstitutionalObjectiveMapper.toDTOList(objectives)
  }
}
