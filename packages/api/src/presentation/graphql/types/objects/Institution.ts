import type { InstitutionRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { InstitutionAreaEnum } from '../enums/InstitutionArea'
import { InstitutionLevelEnum } from '../enums/InstitutionLevel'

export type TInstitution = Pick<
  InstitutionRecord,
  'uid' | 'name' | 'deletedAt' | 'area' | 'level'
>
// & {
//   objetives: TInstitutionEstrategicObjetive[]
// }

export const Institution = builder
  .objectRef<TInstitution>('Institution')
  .implement({
    fields: (t) => ({
      uid: t.exposeID('uid'),
      name: t.exposeString('name'),
      area: t.expose('area', { type: InstitutionAreaEnum }),
      level: t.expose('level', { type: InstitutionLevelEnum }),
      // TODO: Add objetives
      // objetives: t.expose('objetives', { type: [InstitutionEstraticObjetive] }),
      active: t.field({
        type: 'Boolean',
        resolve: (institution) => institution.deletedAt === null,
      }),
      deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    }),
  })
