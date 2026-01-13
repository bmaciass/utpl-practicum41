import builder from '../../schema/builder'
import { institutionGovernanceLevelEnum } from '@sigep/db'

export const InstitutionLevelEnum = builder.enumType('InstitutionLevel', {
  values: institutionGovernanceLevelEnum.enumValues,
})
