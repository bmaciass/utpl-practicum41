import type { InstitutionalPlanRecord } from '@sigep/db'
import builder from '../../schema/builder'
import { Institution } from './Institution'

export type TInstitutionalPlan = Pick<
  InstitutionalPlanRecord,
  'uid' | 'deletedAt' | 'name' | 'url' | 'year' | 'institutionId'
> & {
  active: boolean
}

export const InstitutionalPlan = builder
  .objectRef<TInstitutionalPlan>('InstitutionPlan')
  .implement({
    fields: (t) => ({
      uid: t.exposeID('uid'),
      name: t.exposeString('name'),
      deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
      active: t.field({
        type: 'Boolean',
        resolve: (institutionalPlan) => institutionalPlan.deletedAt === null,
      }),
      year: t.exposeInt('year'),
      url: t.exposeString('url'),
      institution: t.field({
        type: Institution,
        resolve: (institutionalPlan, _, { loaders }) => {
          return loaders.institution.load(institutionalPlan.institutionId)
        },
      }),
    }),
  })
