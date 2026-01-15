import emptyResolver from '~/helpers/emptyResolver'
import builder from '../../../schema/builder'

export const InstitutionalObjectiveQueriesRef = builder.objectRef(
  'institutionalObjective',
)

export const InstitutionalObjectiveQueries = builder.objectType(
  InstitutionalObjectiveQueriesRef,
  {
    name: 'InstitutionalObjectiveQueries',
    description: 'InstitutionalObjective queries',
  },
)

builder.queryField('institutionalObjective', (t) =>
  t.field({
    resolve: emptyResolver,
    type: InstitutionalObjectiveQueriesRef,
  }),
)
