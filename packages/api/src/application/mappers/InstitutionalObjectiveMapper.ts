import type { InstitutionalObjective } from '~/domain/entities/InstitutionalObjective'
import type { InstitutionalObjectiveResponseDTO } from '../dto/institutional-objective'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class InstitutionalObjectiveMapper {
  static toDTO(
    objective: InstitutionalObjective,
  ): InstitutionalObjectiveResponseDTO {
    return {
      id: objective.id,
      uid: objective.uid,
      name: objective.name,
      description: objective.description,
      institutionId: objective.institutionId,
      active: objective.active,
      deletedAt: objective.deletedAt,
    }
  }

  static toDTOList(
    objectives: InstitutionalObjective[],
  ): InstitutionalObjectiveResponseDTO[] {
    return objectives.map(InstitutionalObjectiveMapper.toDTO)
  }
}
