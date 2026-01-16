import type { GoalPayload, GoalRecord } from '@sigep/db'
import { Goal } from '~/domain/entities/Goal'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class GoalMapper {
  static toDomain(record: GoalRecord): Goal {
    return Goal.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      institutionalObjectiveId: record.institutionalObjectiveId,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    })
  }

  static toPersistence(goal: Goal): GoalPayload {
    return {
      uid: goal.uid,
      name: goal.name,
      description: goal.description,
      institutionalObjectiveId: goal.institutionalObjectiveId,
      createdBy: goal.createdBy,
      createdAt: goal.createdAt,
      updatedBy: goal.updatedBy,
      updatedAt: goal.updatedAt,
      deletedAt: goal.deletedAt,
    }
  }
}
