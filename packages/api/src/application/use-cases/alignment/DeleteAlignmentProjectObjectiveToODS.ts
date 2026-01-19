import type { IUseCase } from '@sigep/shared'
import type { IAlignmentProjectObjectiveToODSRepository } from '~/domain/repositories/IAlignmentProjectObjectiveToODSRepository'
import type { IObjectiveODSRepository } from '~/domain/repositories/IObjectiveODSRepository'
import type { IProjectObjectiveRepository } from '~/domain/repositories/IProjectObjectiveRepository'

export interface DeleteAlignmentProjectObjectiveToODSInput {
  projectObjectiveUid: string
  odsObjectiveUid: string
}

export interface DeleteAlignmentProjectObjectiveToODSDeps {
  alignmentRepository: IAlignmentProjectObjectiveToODSRepository
  projectObjectiveRepository: IProjectObjectiveRepository
  odsObjectiveRepository: IObjectiveODSRepository
}

export class DeleteAlignmentProjectObjectiveToODS
  implements IUseCase<DeleteAlignmentProjectObjectiveToODSInput, void>
{
  constructor(private deps: DeleteAlignmentProjectObjectiveToODSDeps) {}

  async execute(
    input: DeleteAlignmentProjectObjectiveToODSInput,
  ): Promise<void> {
    const [projectObjective, ods] = await Promise.all([
      this.deps.projectObjectiveRepository.findByUidOrThrow(
        input.projectObjectiveUid,
      ),
      this.deps.odsObjectiveRepository.findByUidOrThrow(input.odsObjectiveUid),
    ])

    await this.deps.alignmentRepository.deleteByObjectivePair(
      projectObjective.id,
      ods.id,
    )
  }
}
