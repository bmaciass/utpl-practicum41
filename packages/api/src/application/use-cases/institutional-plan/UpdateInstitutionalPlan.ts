import type { IUseCase } from '@sigep/shared'
import type { IInstitutionalPlanRepository } from '~/domain/repositories/IInstitutionalPlanRepository'
import type {
  UpdateInstitutionalPlanDTO,
  InstitutionalPlanResponseDTO,
} from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface UpdateInstitutionalPlanInput {
  uid: string
  data: UpdateInstitutionalPlanDTO
}

export interface UpdateInstitutionalPlanDeps {
  institutionalPlanRepository: IInstitutionalPlanRepository
}

export class UpdateInstitutionalPlan
  implements
    IUseCase<UpdateInstitutionalPlanInput, InstitutionalPlanResponseDTO>
{
  constructor(private deps: UpdateInstitutionalPlanDeps) {}

  async execute(
    input: UpdateInstitutionalPlanInput,
    actorId: string,
  ): Promise<InstitutionalPlanResponseDTO> {
    const plan = await this.deps.institutionalPlanRepository.findByUidOrThrow(
      input.uid,
    )
    const updatedBy = Number(actorId)

    if (input.data.name !== undefined) {
      plan.updateName(input.data.name, updatedBy)
    }
    if (input.data.year !== undefined) {
      plan.updateYear(input.data.year, updatedBy)
    }
    if (input.data.version !== undefined) {
      plan.updateVersion(input.data.version, updatedBy)
    }
    if (input.data.url !== undefined) {
      plan.updateUrl(input.data.url, updatedBy)
    }
    if (input.data.active !== undefined) {
      if (input.data.active) {
        plan.activate(updatedBy)
      } else {
        plan.deactivate(updatedBy)
      }
    }

    await this.deps.institutionalPlanRepository.save(plan)

    return InstitutionalPlanMapper.toDTO(plan)
  }
}
