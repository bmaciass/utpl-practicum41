import { indicatorType } from '@sigep/db'
import builder from '../../schema/builder'

export const IndicatorTypeEnum = builder.enumType('IndicatorType', {
  values: indicatorType.enumValues,
})
