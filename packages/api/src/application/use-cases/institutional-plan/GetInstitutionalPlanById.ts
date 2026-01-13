import type { IInstitutionalPlanRepository } from '~/domain/repositories/IInstitutionalPlanRepository'
import type { InstitutionalPlanResponseDTO } from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface GetInstitutionalPlanByIdDeps {
  institutionalPlanRepository: IInstitutionalPlanRepository
}

export class GetInstitutionalPlanById {
  constructor(private deps: GetInstitutionalPlanByIdDeps) {}

  async execute(uid: string): Promise<InstitutionalPlanResponseDTO | null> {
    const plan = await this.deps.institutionalPlanRepository.findByUid(uid)
    if (!plan) return null
    return InstitutionalPlanMapper.toDTO(plan)
  }
}
