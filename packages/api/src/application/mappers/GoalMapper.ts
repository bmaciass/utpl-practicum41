import type { Goal } from '~/domain/entities/Goal'
import type { GoalResponseDTO } from '../dto/goal'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class GoalApplicationMapper {
  static toDTO(goal: Goal): GoalResponseDTO {
    return {
      id: goal.id,
      uid: goal.uid,
      name: goal.name,
      description: goal.description,
      institutionalObjectiveId: goal.institutionalObjectiveId,
      active: goal.active,
      createdAt: goal.createdAt,
      createdBy: goal.createdBy,
      updatedAt: goal.updatedAt,
      updatedBy: goal.updatedBy,
      deletedAt: goal.deletedAt,
    }
  }
}
