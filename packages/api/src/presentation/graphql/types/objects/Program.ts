import type { ProgramRecord } from '@sigep/db'
import type { Project as ProjectDomain } from '~/domain/entities/Project'
import builder from '../../schema/builder'
import { ProjectRef } from './Project'
import { User } from './User'

export type TProgram = Pick<
  ProgramRecord,
  | 'id'
  | 'uid'
  | 'name'
  | 'startDate'
  | 'endDate'
  | 'estimatedInversion'
  | 'description'
  | 'deletedAt'
  | 'responsibleId'
> & {
  active: boolean
}

// Export the ref for circular dependency resolution
export const ProgramRef = builder.objectRef<TProgram>('Program')

export const Program = ProgramRef.implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    startDate: t.expose('startDate', { type: 'Date', nullable: true }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    estimatedInversion: t.expose('estimatedInversion', {
      type: 'Decimal',
      nullable: true,
    }),
    deletedAt: t.expose('deletedAt', { type: 'Date', nullable: true }),
    active: t.field({
      type: 'Boolean',
      resolve: (program) => program.deletedAt === null,
    }),

    // Field resolver - only executes when client requests this field
    // Uses DataLoader to automatically batch User queries
    responsible: t.field({
      type: User,
      resolve: async (program, _args, { loaders }) => {
        // DataLoader batches multiple load() calls into a single DB query
        return await loaders.user.load(program.responsibleId)
      },
    }),

    // Field resolver - only executes when client requests this field
    // Uses DataLoader to automatically batch Project queries
    projects: t.field({
      type: [ProjectRef],
      resolve: async (program, _args, { loaders }) => {
        // DataLoader batches multiple load() calls into a single DB query
        const records = await loaders.projectByProgramId.load(program.id)

        // TODO: Fix the silent fail
        return records.filter(
          (record) => !(record instanceof Error),
        ) as ProjectDomain[]
      },
    }),
  }),
})
