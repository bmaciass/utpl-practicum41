import type { ProjectObjectiveRecord } from '@sigep/db'
import {
  getAlignmentProjectObjectiveToODSRepository,
  getObjectiveODSRepository,
  getProjectObjectiveRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../schema/builder'
import { ProjectObjectiveStatusEnum } from '../enums/ProjectObjectiveStatus'
import type { TAlignmentProjectObjectiveToODS } from './AlignmentProjectObjectiveToODS'
import { AlignmentProjectObjectiveToODS } from './AlignmentProjectObjectiveToODS'

export type TProjectObjective = Pick<
  ProjectObjectiveRecord,
  'id' | 'uid' | 'name' | 'status' | 'deletedAt' | 'projectId'
> & {
  active: boolean
}

export const ProjectObjectiveRef =
  builder.objectRef<TProjectObjective>('ProjectObjective')

export const ProjectObjective = ProjectObjectiveRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    status: t.expose('status', { type: ProjectObjectiveStatusEnum }),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (objective) => objective.deletedAt === null,
    }),
    alignmentsToODS: t.field({
      type: [AlignmentProjectObjectiveToODS],
      resolve: async (objective, _args, { db }) => {
        const alignmentRepo = getAlignmentProjectObjectiveToODSRepository(db)
        const projectObjectiveRepo = getProjectObjectiveRepository(db)
        const odsObjectiveRepo = getObjectiveODSRepository(db)
        const alignments = await alignmentRepo.findByProjectObjectiveId(
          objective.id,
        )

        const projectObjectiveIds = alignments.map(
          (alignment) => alignment.projectObjectiveId,
        )
        const odsObjectiveIds = alignments.map(
          (alignment) => alignment.odsObjectiveId,
        )

        const [projectObjectives, odsObjectives] = await Promise.all([
          projectObjectiveRepo.findByIds(projectObjectiveIds),
          odsObjectiveRepo.findMany({ where: { id: odsObjectiveIds } }),
        ])

        return alignments.map((alignment): TAlignmentProjectObjectiveToODS => {
          const projectObjectiveUid = projectObjectives.find(
            (item) => item.id === alignment.projectObjectiveId,
          )?.uid
          const odsObjectiveUid = odsObjectives.find(
            (item) => item.id === alignment.odsObjectiveId,
          )?.uid

          if (!projectObjectiveUid || !odsObjectiveUid) {
            throw new Error(
              'project objective uid or ods objective uid not found',
            )
          }

          return {
            id: alignment.id,
            projectObjectiveId: alignment.projectObjectiveId,
            projectObjectiveUid,
            odsObjectiveId: alignment.odsObjectiveId,
            odsObjectiveUid,
            createdAt: alignment.createdAt,
          }
        })
      },
    }),
  }),
})
