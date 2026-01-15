import emptyResolver from '~/helpers/emptyResolver'
import builder from '../../../schema/builder'

export const InstitutionalObjectiveMutationsRef = builder.objectRef(
  'institutionalObjective',
)

export const InstitutionalObjectiveMutations = builder.objectType(
  InstitutionalObjectiveMutationsRef,
  {
    name: 'InstitutionalObjectiveMutations',
    description: 'InstitutionalObjective mutations',
  },
)

builder.mutationField('institutionalObjective', (t) =>
  t.field({
    resolve: emptyResolver,
    type: InstitutionalObjectiveMutationsRef,
  }),
)
