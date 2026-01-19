import { relations } from 'drizzle-orm/relations'
import { Program } from '../tables/program'
import { Project } from '../tables/project'
import { ProjectObjective } from '../tables/projectObjective'
import { ProjectTask } from '../tables/projectTask'
import { User } from '../tables/user'

export const projectRelations = relations(Project, ({ one, many }) => ({
  goals: many(ProjectTask),
  objectives: many(ProjectObjective),
  program: one(Program, {
    fields: [Project.programId],
    references: [Program.id],
  }),
  responsible: one(User, {
    fields: [Project.responsibleId],
    references: [User.id],
  }),
  createdBy: one(User, {
    fields: [Project.createdBy],
    references: [User.id],
  }),
  updatedBy: one(User, {
    fields: [Project.updatedBy],
    references: [User.id],
  }),
}))
