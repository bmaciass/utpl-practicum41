import type { ObjectiveODSRecord } from '@sigep/db'
import builder from '../../schema/builder'

export type TObjectiveODS = Pick<
  ObjectiveODSRecord,
  'id' | 'uid' | 'name' | 'description' | 'deletedAt'
> & {
  active: boolean
}

export const ObjectiveODSRef = builder.objectRef<TObjectiveODS>('ObjectiveODS')

export const ObjectiveODS = ObjectiveODSRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (objectiveODS) => objectiveODS.deletedAt === null,
    }),
  }),
})
