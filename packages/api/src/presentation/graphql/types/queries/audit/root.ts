import emptyResolver from '~/helpers/emptyResolver'
import builder from '~/presentation/graphql/schema/builder'

export const AuditQueriesRef = builder.objectRef('audit')

export const AuditQueries = builder.objectType(AuditQueriesRef, {
  name: 'AuditQueries',
  description: 'Audit queries',
})

builder.queryField('audit', (t) =>
  t.field({
    resolve: emptyResolver,
    type: AuditQueriesRef,
    authScopes: { admin: true },
  }),
)
