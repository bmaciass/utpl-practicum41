import emptyResolver from '~/helpers/emptyResolver'
import builder from '../../../schema/builder'

export const ObjectivePNDMutationsRef = builder.objectRef('objectivePND')

export const ObjectivePNDMutations = builder.objectType(
  ObjectivePNDMutationsRef,
  {
    name: 'ObjectivePNDMutations',
    description: 'ObjectivePND mutations',
  },
)

builder.mutationField('objectivePND', (t) =>
  t.field({
    resolve: emptyResolver,
    type: ObjectivePNDMutationsRef,
  }),
)
