import type { ObjectivePNDRecord } from '@sigep/db'
import {
  getAlignmentInstitutionalToPNDRepository,
  getAlignmentPNDToODSRepository,
  getInstitutionalObjectiveRepository,
  getObjectiveODSRepository,
  getObjectivePNDRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../schema/builder'
import type { TAlignmentInstitutionalToPND } from './AlignmentInstitutionalToPND'
import { AlignmentInstitutionalToPND } from './AlignmentInstitutionalToPND'
import type { TAlignmentPNDToODS } from './AlignmentPNDToODS'
import { AlignmentPNDToODS } from './AlignmentPNDToODS'

export type TObjectivePND = Pick<
  ObjectivePNDRecord,
  'id' | 'uid' | 'name' | 'description' | 'deletedAt'
> & {
  active: boolean
}

export const ObjectivePNDRef = builder.objectRef<TObjectivePND>('ObjectivePND')

export const ObjectivePND = ObjectivePNDRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (objective) => objective.deletedAt === null,
    }),

    // Alignments FROM institutional objectives
    alignmentsFromInstitutional: t.field({
      type: [AlignmentInstitutionalToPND],
      resolve: async (objective, _args, { db }) => {
        const alignmentRepo = getAlignmentInstitutionalToPNDRepository(db)
        const institutionalObjectiveRepo =
          getInstitutionalObjectiveRepository(db)
        const pndObjectiveRepo = getObjectivePNDRepository(db)
        const alignments = await alignmentRepo.findByPNDObjectiveId(
          objective.id,
        )

        const institutionalObjectiveIds = alignments.map(
          (a) => a.institutionalObjectiveId,
        )
        const pndObjectiveIds = alignments.map((a) => a.pndObjectiveId)

        const [institutionalObjectives, pndObjectives] = await Promise.all([
          institutionalObjectiveRepo.findMany({
            where: { id: institutionalObjectiveIds },
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
              'institutional objective uid or pnd objective uid not found',
            )

          return {
            id: a.id,
            institutionalObjectiveId: a.institutionalObjectiveId,
            institutionalObjectiveUid,
            pndObjectiveId: a.pndObjectiveId,
            pndObjectiveUid,
            createdAt: a.createdAt,
          }
        })
      },
    }),

    // Alignments TO ODS objectives
    alignmentsToODS: t.field({
      type: [AlignmentPNDToODS],
      resolve: async (objective, _args, { db }) => {
        const alignmentRepo = getAlignmentPNDToODSRepository(db)
        const pndObjectiveRepo = getObjectivePNDRepository(db)
        const odsObjectiveRepo = getObjectiveODSRepository(db)
        const alignments = await alignmentRepo.findByPNDObjectiveId(
          objective.id,
        )

        const pndObjectiveIds = alignments.map((a) => a.pndObjectiveId)
        const odsObjectiveIds = alignments.map((a) => a.odsObjectiveId)

        const [pndObjectives, odsObjectives] = await Promise.all([
          pndObjectiveRepo.findMany({ where: { id: pndObjectiveIds } }),
          odsObjectiveRepo.findMany({
            where: { id: odsObjectiveIds },
          }),
        ])

        return alignments.map((a): TAlignmentPNDToODS => {
          const pndObjectiveUid = pndObjectives.find(
            (o) => o.id === a.pndObjectiveId,
          )?.uid
          const odsObjectiveUid = odsObjectives.find(
            (o) => o.id === a.odsObjectiveId,
          )?.uid

          if (!pndObjectiveUid || !odsObjectiveUid)
            throw new Error('pnd objective uid or ods objective uid not found')

          return {
            id: a.id,
            pndObjectiveId: a.pndObjectiveId,
            pndObjectiveUid,
            odsObjectiveId: a.odsObjectiveId,
            odsObjectiveUid,
            createdAt: a.createdAt,
          }
        })
      },
    }),
  }),
})
