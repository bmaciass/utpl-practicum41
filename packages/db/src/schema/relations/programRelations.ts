import { relations } from 'drizzle-orm/relations'
import { Program } from '../tables/program'
import { Project } from '../tables/project'
import { User } from '../tables/user'

export const programRelations = relations(Program, ({ one, many }) => ({
  projects: many(Project),
  responsible: one(User, {
    fields: [Program.responsibleId],
    references: [User.id],
  }),
  createdBy: one(User, {
    fields: [Program.createdBy],
    references: [User.id],
  }),
  updatedBy: one(User, {
    fields: [Program.updatedBy],
    references: [User.id],
  }),
}))
