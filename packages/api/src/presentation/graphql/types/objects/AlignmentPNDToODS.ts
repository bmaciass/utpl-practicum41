import builder from '../../schema/builder'

export type TAlignmentPNDToODS = {
  id: number
  pndObjectiveId: number
  pndObjectiveUid: string
  odsObjectiveId: number
  odsObjectiveUid: string
  createdAt: Date
}

export const AlignmentPNDToODSRef =
  builder.objectRef<TAlignmentPNDToODS>('AlignmentPNDToODS')

export const AlignmentPNDToODS = AlignmentPNDToODSRef.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    pndObjectiveUid: t.exposeString('pndObjectiveUid'),
    odsObjectiveUid: t.exposeString('odsObjectiveUid'),
    // pndObjectiveId: t.exposeInt('pndObjectiveId'),
    // odsObjectiveId: t.e

    // Field resolvers with DataLoader batching
    // pndObjective: t.field({
    //   type: ObjectivePND,
    //   resolve: async (alignment, _args, { loaders }) => {
    //     return await loaders.pndObjective.load(alignment.pndObjectiveId)
    //   },
    // }),

    // odsObjective: t.field({
    //   type: ObjectiveODS,
    //   resolve: async (alignment, _args, { loaders }) => {
    //     return await loaders.odsObjective.load(alignment.odsObjectiveId)
    //   },
    // }),
  }),
})
