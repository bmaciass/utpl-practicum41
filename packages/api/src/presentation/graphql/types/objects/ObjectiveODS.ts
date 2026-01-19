import type { ObjectiveODSRecord } from '@sigep/db'
import {
  getAlignmentPNDToODSRepository,
  getAlignmentProjectObjectiveToODSRepository,
  getObjectiveODSRepository,
  getObjectivePNDRepository,
  getProjectObjectiveRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../schema/builder'
import type { TAlignmentPNDToODS } from './AlignmentPNDToODS'
import { AlignmentPNDToODS } from './AlignmentPNDToODS'
import type { TAlignmentProjectObjectiveToODS } from './AlignmentProjectObjectiveToODS'
import { AlignmentProjectObjectiveToODS } from './AlignmentProjectObjectiveToODS'

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

    // Alignments FROM PND objectives
    alignmentsFromPND: t.field({
      type: [AlignmentPNDToODS],
      resolve: async (objective, _args, { db }) => {
        const alignmentRepo = getAlignmentPNDToODSRepository(db)
        const pndObjectiveRepo = getObjectivePNDRepository(db)
        const odsObjectiveRepo = getObjectiveODSRepository(db)
        const alignments = await alignmentRepo.findByODSObjectiveId(
          objective.id,
        )

        const odsObjectiveIds = alignments.map((a) => a.odsObjectiveId)
        const pndObjectiveIds = alignments.map((a) => a.pndObjectiveId)

        const [odsObjectives, pndObjectives] = await Promise.all([
          odsObjectiveRepo.findMany({
            where: { id: odsObjectiveIds },
          }),
          pndObjectiveRepo.findMany({ where: { id: pndObjectiveIds } }),
        ])

        return alignments.map((a): TAlignmentPNDToODS => {
          const odsObjectiveUid = odsObjectives.find(
            (o) => o.id === a.odsObjectiveId,
          )?.uid
          const pndObjectiveUid = pndObjectives.find(
            (o) => o.id === a.pndObjectiveId,
          )?.uid

          if (!odsObjectiveUid || !pndObjectiveUid)
            throw new Error(
              'pnd objective uid or institutional objective uid not found',
            )

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

    // Alignments FROM project objectives
    alignmentsFromProjectObjectives: t.field({
      type: [AlignmentProjectObjectiveToODS],
      resolve: async (objective, _args, { db }) => {
        const alignmentRepo = getAlignmentProjectObjectiveToODSRepository(db)
        const projectObjectiveRepo = getProjectObjectiveRepository(db)
        const odsObjectiveRepo = getObjectiveODSRepository(db)
        const alignments = await alignmentRepo.findByODSObjectiveId(
          objective.id,
        )

        const odsObjectiveIds = alignments.map((a) => a.odsObjectiveId)
        const projectObjectiveIds = alignments.map((a) => a.projectObjectiveId)

        const [odsObjectives, projectObjectives] = await Promise.all([
          odsObjectiveRepo.findMany({ where: { id: odsObjectiveIds } }),
          projectObjectiveRepo.findByIds(projectObjectiveIds),
        ])

        return alignments.map((a): TAlignmentProjectObjectiveToODS => {
          const odsObjectiveUid = odsObjectives.find(
            (o) => o.id === a.odsObjectiveId,
          )?.uid
          const projectObjectiveUid = projectObjectives.find(
            (o) => o.id === a.projectObjectiveId,
          )?.uid

          if (!odsObjectiveUid || !projectObjectiveUid) {
            throw new Error(
              'project objective uid or ods objective uid not found',
            )
          }

          return {
            id: a.id,
            projectObjectiveId: a.projectObjectiveId,
            projectObjectiveUid,
            odsObjectiveId: a.odsObjectiveId,
            odsObjectiveUid,
            createdAt: a.createdAt,
          }
        })
      },
    }),
  }),
})
