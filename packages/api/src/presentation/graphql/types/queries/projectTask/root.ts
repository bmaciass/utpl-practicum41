import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ProjectTaskQueriesRef = builder.objectRef('projectTask')

export const ProjectTaskQueries = builder.objectType(ProjectTaskQueriesRef, {
  name: 'ProjectTaskQueries',
  description: 'ProjectTask queries',
})

builder.queryField('projectTask', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ProjectTaskQueriesRef,
  }),
)
