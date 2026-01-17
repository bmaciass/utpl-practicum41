import type { IndicatorPayload, IndicatorRecord } from '@sigep/db'
import { Indicator } from '~/domain/entities/Indicator'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class IndicatorPersistenceMapper {
  static toDomain(record: IndicatorRecord): Indicator {
    return Indicator.reconstitute({
      id: record.id,
      uid: record.uid,
      name: record.name,
      description: record.description,
      type: record.type,
      unitType: record.unitType,
      minValue: record.minValue,
      maxValue: record.maxValue,
      goalId: record.goalId,
      deletedAt: record.deletedAt,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedBy: record.updatedBy,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(indicator: Indicator): IndicatorPayload {
    return {
      uid: indicator.uid,
      name: indicator.name,
      description: indicator.description,
      type: indicator.type,
      unitType: indicator.unitType,
      minValue: indicator.minValue,
      maxValue: indicator.maxValue,
      goalId: indicator.goalId,
      createdBy: indicator.createdBy,
      createdAt: indicator.createdAt,
      updatedBy: indicator.updatedBy,
      updatedAt: indicator.updatedAt,
      deletedAt: indicator.deletedAt,
    }
  }
}
