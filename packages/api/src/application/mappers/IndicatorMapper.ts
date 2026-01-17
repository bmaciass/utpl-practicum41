import type { Indicator } from '~/domain/entities/Indicator'
import type { IndicatorResponseDTO } from '../dto/indicator'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class IndicatorApplicationMapper {
  static toDTO(indicator: Indicator): IndicatorResponseDTO {
    return {
      id: indicator.id,
      uid: indicator.uid,
      name: indicator.name,
      description: indicator.description,
      type: indicator.type,
      unitType: indicator.unitType,
      minValue: indicator.minValue,
      maxValue: indicator.maxValue,
      goalId: indicator.goalId,
      active: indicator.active,
      createdAt: indicator.createdAt,
      createdBy: indicator.createdBy,
      updatedAt: indicator.updatedAt,
      updatedBy: indicator.updatedBy,
      deletedAt: indicator.deletedAt,
    }
  }
}
