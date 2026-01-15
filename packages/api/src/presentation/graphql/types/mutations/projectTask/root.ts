import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ProjectTaskMutationsRef = builder.objectRef('projectTask')

export const ProjectTaskMutations = builder.objectType(
  ProjectTaskMutationsRef,
  {
    name: 'ProjectTaskMutations',
    description: 'ProjectTask mutations',
  },
)

builder.mutationField('projectTask', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ProjectTaskMutationsRef,
  }),
)
