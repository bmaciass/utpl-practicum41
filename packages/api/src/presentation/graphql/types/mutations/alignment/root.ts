import emptyResolver from '~/helpers/emptyResolver'
import builder from '../../../schema/builder'

export const AlignmentMutationsRef = builder.objectRef('alignment')

export const AlignmentMutations = builder.objectType(AlignmentMutationsRef, {
  name: 'AlignmentMutations',
  description: 'Alignment mutations',
})

builder.mutationField('alignment', (t) =>
  t.field({
    resolve: emptyResolver,
    type: AlignmentMutationsRef,
  }),
)
