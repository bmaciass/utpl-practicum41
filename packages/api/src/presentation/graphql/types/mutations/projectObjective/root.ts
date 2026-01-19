import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ProjectObjectiveMutationsRef =
  builder.objectRef('projectObjective')

export const ProjectObjectiveMutations = builder.objectType(
  ProjectObjectiveMutationsRef,
  {
    name: 'ProjectObjectiveMutations',
    description: 'ProjectObjective mutations',
  },
)

builder.mutationField('projectObjective', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ProjectObjectiveMutationsRef,
  }),
)
