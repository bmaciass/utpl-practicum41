import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ProjectGoalMutationsRef = builder.objectRef('projectGoal')

export const ProjectGoalMutations = builder.objectType(
  ProjectGoalMutationsRef,
  {
    name: 'ProjectGoalMutations',
    description: 'ProjectGoal mutations',
  },
)

builder.mutationField('projectGoal', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ProjectGoalMutationsRef,
  }),
)
