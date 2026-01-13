import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const InstitutionalPlanQueriesRef =
  builder.objectRef('institutionalPlan')

export const InstitutionalPlanQueries = builder.objectType(
  InstitutionalPlanQueriesRef,
  {
    name: 'InstitutionalPlanQueries',
    description: 'Institutional Plan queries',
  },
)

builder.queryField('institutionalPlan', (t) =>
  t.field({
    resolve: emptyResolver,
    type: InstitutionalPlanQueriesRef,
  }),
)
