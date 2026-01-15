import type { IUseCase } from '@sigep/shared'
import type { IAlignmentInstitutionalToPNDRepository } from '~/domain/repositories/IAlignmentInstitutionalToPNDRepository'
import type { IInstitutionalObjectiveRepository } from '~/domain/repositories/IInstitutionalObjectiveRepository'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'

export interface DeleteAlignmentInstitutionalToPNDInput {
  institutionalObjectiveUid: string
  pndObjectiveUid: string
}

export interface DeleteAlignmentInstitutionalToPNDDeps {
  alignmentRepository: IAlignmentInstitutionalToPNDRepository
  institutionalObjectiveRepository: IInstitutionalObjectiveRepository
  pndObjectiveRepository: IObjectivePNDRepository
}

export class DeleteAlignmentInstitutionalToPND
  implements IUseCase<DeleteAlignmentInstitutionalToPNDInput, void>
{
  constructor(private deps: DeleteAlignmentInstitutionalToPNDDeps) {}

  async execute(input: DeleteAlignmentInstitutionalToPNDInput): Promise<void> {
    // 1. Resolve objective IDs from UIDs
    const [institutional, pnd] = await Promise.all([
      this.deps.institutionalObjectiveRepository.findByUidOrThrow(
        input.institutionalObjectiveUid,
      ),
      this.deps.pndObjectiveRepository.findByUidOrThrow(input.pndObjectiveUid),
    ])

    // 2. Delete alignment by objective pair
    await this.deps.alignmentRepository.deleteByObjectivePair(
      institutional.id,
      pnd.id,
    )
  }
}
