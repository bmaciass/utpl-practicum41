import { projectTaskStatusEnum } from '@sigep/db'
import builder from '../../schema/builder'

export const ProjectTaskStatusEnum = builder.enumType('ProjectTaskStatus', {
  values: projectTaskStatusEnum.enumValues,
})
