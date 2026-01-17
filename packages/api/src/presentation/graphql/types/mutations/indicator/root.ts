import builder from '../../../schema/builder'

export const IndicatorMutations =
  builder.objectRef<object>('IndicatorMutations')

IndicatorMutations.implement({
  fields: () => ({}),
})

builder.mutationField('indicator', (t) =>
  t.field({
    type: IndicatorMutations,
    resolve: () => ({}),
  }),
)
