import type { IUseCase } from '@sigep/shared'
import type { IInstitutionalPlanRepository } from '~/domain/repositories/IInstitutionalPlanRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import type {
  InstitutionalPlanResponseDTO,
  UpdateInstitutionalPlanDTO,
} from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface UpdateInstitutionalPlanInput {
  uid: string
  data: UpdateInstitutionalPlanDTO
}

export interface UpdateInstitutionalPlanDeps {
  institutionalPlanRepository: IInstitutionalPlanRepository
  userRepository: IUserRepository
}

export class UpdateInstitutionalPlan
  implements
    IUseCase<UpdateInstitutionalPlanInput, InstitutionalPlanResponseDTO>
{
  constructor(private deps: UpdateInstitutionalPlanDeps) {}

  async execute(
    input: UpdateInstitutionalPlanInput,
    userUid: string,
  ): Promise<InstitutionalPlanResponseDTO> {
    const [plan, user] = await Promise.all([
      this.deps.institutionalPlanRepository.findByUidOrThrow(input.uid),
      this.deps.userRepository.findByUidOrThrow(userUid),
    ])
    const updatedBy = user.id

    if (input.data.name !== undefined) {
      plan.updateName(input.data.name, updatedBy)
    }
    if (input.data.year !== undefined) {
      plan.updateYear(input.data.year, updatedBy)
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
