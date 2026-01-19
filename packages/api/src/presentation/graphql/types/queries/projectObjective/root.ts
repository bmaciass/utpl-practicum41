import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ProjectObjectiveQueriesRef = builder.objectRef('projectObjective')

export const ProjectObjectiveQueries = builder.objectType(
  ProjectObjectiveQueriesRef,
  {
    name: 'ProjectObjectiveQueries',
    description: 'ProjectObjective queries',
  },
)

builder.queryField('projectObjective', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ProjectObjectiveQueriesRef,
  }),
)
