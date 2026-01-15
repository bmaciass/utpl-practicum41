import emptyResolver from '~/helpers/emptyResolver'
import builder from '../../../schema/builder'

export const ObjectiveODSQueriesRef = builder.objectRef('objectiveODS')

export const ObjectiveODSQueries = builder.objectType(ObjectiveODSQueriesRef, {
  name: 'ObjectiveODSQueries',
  description: 'ObjectiveODS queries',
})

builder.queryField('objectiveODS', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ObjectiveODSQueriesRef,
  }),
)
