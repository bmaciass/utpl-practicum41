import type { ProjectObjectivePayload } from '@sigep/db'
import type { SetOptional } from 'type-fest'
import { UpdateProjectObjective } from '~/application/use-cases/project-objective'
import {
  getProjectObjectiveRepository,
  getUserRepository,
} from '~/infrastructure/persistence/drizzle/repositories'
import builder from '../../../schema/builder'
import { ProjectObjectiveStatusEnum } from '../../enums/ProjectObjectiveStatus'
import { ProjectObjective } from '../../objects/ProjectObjective'
import { ProjectObjectiveMutations } from './root'

type TUpdateProjectObjectiveWhereInput = {
  uid: string
}

export const UpdateProjectObjectiveWhereInput = builder
  .inputRef<TUpdateProjectObjectiveWhereInput>(
    'UpdateProjectObjectiveWhereInput',
  )
  .implement({
    fields: (t) => ({
      uid: t.string({ required: true }),
    }),
  })

type TUpdateProjectObjectiveDataInput = Pick<
  SetOptional<ProjectObjectivePayload, 'name' | 'status'>,
  'name' | 'status'
> & {
  active?: boolean
}

export const UpdateProjectObjectiveDataInput = builder
  .inputRef<TUpdateProjectObjectiveDataInput>('UpdateProjectObjectiveDataInput')
  .implement({
    fields: (t) => ({
      name: t.string({ required: false }),
      status: t.field({ type: ProjectObjectiveStatusEnum, required: false }),
      active: t.boolean({ required: false }),
    }),
  })

builder.objectField(ProjectObjectiveMutations, 'update', (t) =>
  t.field({
    type: ProjectObjective,
    authScopes: { protected: true },
    args: {
      where: t.arg({ type: UpdateProjectObjectiveWhereInput, required: true }),
      data: t.arg({ type: UpdateProjectObjectiveDataInput, required: true }),
    },
    resolve: async (_, { data, where }, { db, user }) => {
      const projectObjectiveRepository = getProjectObjectiveRepository(db)
      const userRepository = getUserRepository(db)
      const updateProjectObjective = new UpdateProjectObjective({
        projectObjectiveRepository,
        userRepository,
      })

      const objective = await updateProjectObjective.execute(
        {
          uid: where.uid,
          data: {
            name: data.name ?? undefined,
            status: data.status ?? undefined,
            active: data.active ?? undefined,
          },
        },
        user.uid,
      )

      return {
        id: objective.id,
        uid: objective.uid,
        name: objective.name,
        status: objective.status,
        active: objective.active,
        projectId: objective.projectId,
        deletedAt: objective.deletedAt,
      }
    },
  }),
)
