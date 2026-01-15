import type { InstitutionEstrategicObjetiveRecord } from '@sigep/db'
import {
  getAlignmentInstitutionalToPNDRepository,
  getInstitutionalObjectiveRepository,
  getObjectivePNDRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../schema/builder'
import type { TAlignmentInstitutionalToPND } from './AlignmentInstitutionalToPND'
import { AlignmentInstitutionalToPND } from './AlignmentInstitutionalToPND'
import { Institution } from './Institution'

export type TInstitutionalObjective = Pick<
  InstitutionEstrategicObjetiveRecord,
  'id' | 'uid' | 'name' | 'description' | 'deletedAt' | 'institutionId'
> & {
  active: boolean
}

export const InstitutionalObjectiveRef =
  builder.objectRef<TInstitutionalObjective>('InstitutionalObjective')

export const InstitutionalObjective = InstitutionalObjectiveRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (objective) => objective.deletedAt === null,
    }),

    // Field resolver - only executes when client requests this field
    // Uses DataLoader to automatically batch Institution queries
    institution: t.field({
      type: Institution,
      resolve: async (objective, _args, { loaders }) => {
        // DataLoader batches multiple load() calls into a single DB query
        return await loaders.institution.load(objective.institutionId)
      },
    }),

    // Alignments to PND objectives
    alignments: t.field({
      type: [AlignmentInstitutionalToPND],
      resolve: async (objective, _args, { db }) => {
        const alignmentRepo = getAlignmentInstitutionalToPNDRepository(db)
        const institutionalObjectiveRepo =
          getInstitutionalObjectiveRepository(db)
        const pndObjectiveRepo = getObjectivePNDRepository(db)
        const alignments = await alignmentRepo.findByInstitutionalObjectiveId(
          objective.id,
        )

        const institucionalObjectiveIds = alignments.map(
          (a) => a.institutionalObjectiveId,
        )
        const pndObjectiveIds = alignments.map((a) => a.pndObjectiveId)

        const [institutionalObjectives, pndObjectives] = await Promise.all([
          institutionalObjectiveRepo.findMany({
            where: { id: institucionalObjectiveIds },
          }),
          pndObjectiveRepo.findMany({ where: { id: pndObjectiveIds } }),
        ])

        return alignments.map((a): TAlignmentInstitutionalToPND => {
          const institutionalObjectiveUid = institutionalObjectives.find(
            (o) => o.id === a.institutionalObjectiveId,
          )?.uid
          const pndObjectiveUid = pndObjectives.find(
            (o) => o.id === a.pndObjectiveId,
          )?.uid

          if (!institutionalObjectiveUid || !pndObjectiveUid)
            throw new Error(
              'pnd objective uid or institutional objective uid not found',
            )

          return {
            id: a.id,
            institutionalObjectiveId: a.institutionalObjectiveId,
            institutionalObjectiveUid,
            pndObjectiveUid,
            pndObjectiveId: a.pndObjectiveId,
            createdAt: a.createdAt,
          }
        })
      },
    }),
  }),
})
