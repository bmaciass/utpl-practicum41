import builder from '../../../schema/builder'

export const IndicatorQueries = builder.objectRef<object>('IndicatorQueries')

IndicatorQueries.implement({
  fields: () => ({}),
})

builder.queryField('indicator', (t) =>
  t.field({
    type: IndicatorQueries,
    resolve: () => ({}),
  }),
)
