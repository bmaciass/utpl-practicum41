import type { InstitutionalPlan } from '~/domain/entities/InstitutionalPlan'
import type { InstitutionalPlanResponseDTO } from '../dto/institutional-plan'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class InstitutionalPlanMapper {
  static toDTO(entity: InstitutionalPlan): InstitutionalPlanResponseDTO {
    return {
      uid: entity.uid,
      name: entity.name,
      year: entity.year,
      url: entity.url,
      active: entity.active,
      deletedAt: entity.deletedAt,
      institutionId: entity.institutionId,
    }
  }

  static toDTOList(
    entities: InstitutionalPlan[],
  ): InstitutionalPlanResponseDTO[] {
    return entities.map(InstitutionalPlanMapper.toDTO)
  }
}
