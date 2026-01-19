import builder from '../../schema/builder'

export type TAlignmentProjectObjectiveToODS = {
  id: number
  projectObjectiveId: number
  projectObjectiveUid: string
  odsObjectiveId: number
  odsObjectiveUid: string
  createdAt: Date
}

export const AlignmentProjectObjectiveToODSRef =
  builder.objectRef<TAlignmentProjectObjectiveToODS>(
    'AlignmentProjectObjectiveToODS',
  )

export const AlignmentProjectObjectiveToODS =
  AlignmentProjectObjectiveToODSRef.implement({
    fields: (t) => ({
      id: t.exposeID('id'),
      createdAt: t.expose('createdAt', { type: 'Date' }),
      projectObjectiveUid: t.exposeString('projectObjectiveUid'),
      odsObjectiveUid: t.exposeString('odsObjectiveUid'),
    }),
  })
