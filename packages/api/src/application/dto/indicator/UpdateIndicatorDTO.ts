import type { IndicatorType } from '~/domain/entities/Indicator'

export interface UpdateIndicatorDTO {
  name?: string
  description?: string | null
  type?: IndicatorType | null
  unitType?: string | null
  minValue?: number | null
  maxValue?: number | null
  goalUid?: string
  active?: boolean
}
