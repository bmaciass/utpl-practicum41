import builder from '../../../schema/builder'

export const GoalQueries = builder.objectRef<object>('GoalQueries')

GoalQueries.implement({
  fields: () => ({}),
})

builder.queryField('goal', (t) =>
  t.field({
    type: GoalQueries,
    resolve: () => ({}),
  }),
)
