import builder from '../../../schema/builder'

export const GoalMutations = builder.objectRef<object>('GoalMutations')

GoalMutations.implement({
  fields: () => ({}),
})

builder.mutationField('goal', (t) =>
  t.field({
    type: GoalMutations,
    resolve: () => ({}),
  }),
)
