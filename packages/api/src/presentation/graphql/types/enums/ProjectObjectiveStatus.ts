import { projectTaskStatusEnum } from '@sigep/db'
import builder from '../../schema/builder'

export const ProjectObjectiveStatusEnum = builder.enumType(
  'ProjectObjectiveStatus',
  {
    values: projectTaskStatusEnum.enumValues,
  },
)
