import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const ReportsQueriesRef = builder.objectRef('reports')

export const ReportsQueries = builder.objectType(ReportsQueriesRef, {
  name: 'ReportsQueries',
  description: 'Reports queries',
})

builder.queryField('reports', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ReportsQueriesRef,
  }),
)
