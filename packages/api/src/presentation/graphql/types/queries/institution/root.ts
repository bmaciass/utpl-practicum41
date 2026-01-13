import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const InstitutionQueriesRef = builder.objectRef('institution')

export const InstitutionQueries = builder.objectType(InstitutionQueriesRef, {
  name: 'InstitutionQueries',
  description: 'Institution queries',
})

builder.queryField('institution', (t) =>
  t.field({
    resolve: emptyResolver,
    type: InstitutionQueriesRef,
  }),
)
