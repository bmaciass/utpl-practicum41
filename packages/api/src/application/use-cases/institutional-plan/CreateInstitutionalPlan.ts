import { type IUseCase, NotFoundError } from '@sigep/shared'
import { InstitutionalPlan } from '~/domain/entities/InstitutionalPlan'
import type { IInstitutionRepository } from '~/domain/repositories/IInstitutionRepository'
import type { IInstitutionalPlanRepository } from '~/domain/repositories/IInstitutionalPlanRepository'
import type {
  CreateInstitutionalPlanDTO,
  InstitutionalPlanResponseDTO,
} from '../../dto/institutional-plan'
import { InstitutionalPlanMapper } from '../../mappers/InstitutionalPlanMapper'

export interface CreateInstitutionalPlanDeps {
  institutionRepository: IInstitutionRepository
  institutionalPlanRepository: IInstitutionalPlanRepository
}

export class CreateInstitutionalPlan
  implements IUseCase<CreateInstitutionalPlanDTO, InstitutionalPlanResponseDTO>
{
  constructor(private deps: CreateInstitutionalPlanDeps) {}

  async execute(
    input: CreateInstitutionalPlanDTO,
    actorId: string,
  ): Promise<InstitutionalPlanResponseDTO> {
    const institution = await this.deps.institutionRepository.findByUid(
      input.institutionUid,
    )

    if (!institution)
      throw new NotFoundError('institution', input.institutionUid)

    const plan = InstitutionalPlan.create({
      name: input.name,
      year: input.year,
      version: input.version,
      url: input.url,
      institutionId: institution.id,
      createdBy: Number(actorId),
    })

    await this.deps.institutionalPlanRepository.save(plan)

    return InstitutionalPlanMapper.toDTO(plan)
  }
}
