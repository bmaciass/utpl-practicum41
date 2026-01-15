import emptyResolver from '~/helpers/emptyResolver'
import builder from '../../../schema/builder'

export const ObjectivePNDQueriesRef = builder.objectRef('objectivePND')

export const ObjectivePNDQueries = builder.objectType(ObjectivePNDQueriesRef, {
  name: 'ObjectivePNDQueries',
  description: 'ObjectivePND queries',
})

builder.queryField('objectivePND', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ObjectivePNDQueriesRef,
  }),
)
