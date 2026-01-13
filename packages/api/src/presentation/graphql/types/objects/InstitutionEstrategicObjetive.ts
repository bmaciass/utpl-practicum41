import type { InstitutionEstrategicObjetiveRecord } from '@sigep/db'
import builder from '../../schema/builder'

export type TInstitutionEstrategicObjetive = Pick<
  InstitutionEstrategicObjetiveRecord,
  'uid' | 'deletedAt' | 'endDate' | 'startDate' | 'name'
>

export const InstitutionEstraticObjetive = builder
  .objectRef<TInstitutionEstrategicObjetive>('InstitutionEstraticObjetive')
  .implement({
    fields: (t) => ({
      uid: t.exposeID('uid'),
      name: t.exposeString('name'),
      startDate: t.expose('startDate', { type: 'Date', nullable: true }),
      endDate: t.expose('endDate', { type: 'Date', nullable: true }),
      active: t.field({
        type: 'Boolean',
        resolve: (objective) => objective.deletedAt === null,
      }),
    }),
  })
