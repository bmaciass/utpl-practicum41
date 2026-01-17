import type { IndicatorType } from '~/domain/entities/Indicator'

export interface IndicatorResponseDTO {
  id: number
  uid: string
  name: string
  description: string | null
  type: IndicatorType | null
  unitType: string | null
  minValue: number | null
  maxValue: number | null
  goalId: number
  active: boolean
  createdAt: Date
  createdBy: number
  updatedAt: Date | null
  updatedBy: number | null
  deletedAt: Date | null
}
