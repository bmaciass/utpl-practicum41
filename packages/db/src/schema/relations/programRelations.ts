import { relations } from 'drizzle-orm/relations'
import { Institution } from '../tables/institution'
import { Program } from '../tables/program'
import { Project } from '../tables/project'
import { User } from '../tables/user'

export const programRelations = relations(Program, ({ one, many }) => ({
  projects: many(Project),
  institution: one(Institution, {
    fields: [Program.institutionId],
    references: [Institution.id],
  }),
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
