import builder from '../../schema/builder'

export type TAlignmentInstitutionalToPND = {
  id: number
  institutionalObjectiveId: number
  institutionalObjectiveUid: string
  pndObjectiveId: number
  pndObjectiveUid: string
  createdAt: Date
}

export const AlignmentInstitutionalToPNDRef =
  builder.objectRef<TAlignmentInstitutionalToPND>('AlignmentInstitutionalToPND')

export const AlignmentInstitutionalToPND =
  AlignmentInstitutionalToPNDRef.implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      createdAt: t.expose('createdAt', { type: 'Date' }),
      pndObjectiveUid: t.exposeString('pndObjectiveUid'),
      institutionalObjectiveUid: t.exposeString('institutionalObjectiveUid'),

      // Field resolvers with DataLoader batching
      // institutionalObjective: t.field({
      //   type: InstitutionalObjective,
      //   resolve: async (alignment, _args, { loaders }) => {
      //     return await loaders.institutionalObjective.load(
      //       alignment.institutionalObjectiveId,
      //     )
      //   },
      // }),

      // pndObjective: t.field({
      //   type: ObjectivePND,
      //   resolve: async (alignment, _args, { loaders }) => {
      //     return await loaders.pndObjective.load(alignment.pndObjectiveId)
      //   },
      // }),
    }),
  })
