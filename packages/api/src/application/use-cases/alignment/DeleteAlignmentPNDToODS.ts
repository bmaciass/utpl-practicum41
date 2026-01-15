import type { IUseCase } from '@sigep/shared'
import type { IAlignmentPNDToODSRepository } from '~/domain/repositories/IAlignmentPNDToODSRepository'
import type { IObjectiveODSRepository } from '~/domain/repositories/IObjectiveODSRepository'
import type { IObjectivePNDRepository } from '~/domain/repositories/IObjectivePNDRepository'

export interface DeleteAlignmentPNDToODSInput {
  pndObjectiveUid: string
  odsObjectiveUid: string
}

export interface DeleteAlignmentPNDToODSDeps {
  alignmentRepository: IAlignmentPNDToODSRepository
  pndObjectiveRepository: IObjectivePNDRepository
  odsObjectiveRepository: IObjectiveODSRepository
}

export class DeleteAlignmentPNDToODS
  implements IUseCase<DeleteAlignmentPNDToODSInput, void>
{
  constructor(private deps: DeleteAlignmentPNDToODSDeps) {}

  async execute(input: DeleteAlignmentPNDToODSInput): Promise<void> {
    // 1. Resolve objective IDs from UIDs
    const [pnd, ods] = await Promise.all([
      this.deps.pndObjectiveRepository.findByUidOrThrow(input.pndObjectiveUid),
      this.deps.odsObjectiveRepository.findByUidOrThrow(input.odsObjectiveUid),
    ])

    // 2. Delete alignment by objective pair
    await this.deps.alignmentRepository.deleteByObjectivePair(pnd.id, ods.id)
  }
}
