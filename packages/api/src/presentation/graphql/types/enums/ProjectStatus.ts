import builder from '../../schema/builder'
import { projectStatusEnum } from '@sigep/db'

export const ProjectStatusEnum = builder.enumType('ProjectStatus', {
  values: projectStatusEnum.enumValues,
})
