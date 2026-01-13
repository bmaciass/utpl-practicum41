import { relations } from 'drizzle-orm/relations'
import { Project } from '../tables/project'
import { ProjectGoal } from '../tables/projectGoal'
import { User } from '../tables/user'

export const projectGoalsRelations = relations(ProjectGoal, ({ one }) => ({
  project: one(Project, {
    fields: [ProjectGoal.projectId],
    references: [Project.id],
  }),
  createdBy: one(User, {
    fields: [ProjectGoal.createdBy],
    references: [User.id],
  }),
  updatedBy: one(User, {
    fields: [ProjectGoal.updatedBy],
    references: [User.id],
  }),
}))
