import { relations } from 'drizzle-orm/relations'
import { Project } from '../tables/project'
import { ProjectTask } from '../tables/projectTask'
import { User } from '../tables/user'

export const projectGoalsRelations = relations(ProjectTask, ({ one }) => ({
  project: one(Project, {
    fields: [ProjectTask.projectId],
    references: [Project.id],
  }),
  createdBy: one(User, {
    fields: [ProjectTask.createdBy],
    references: [User.id],
  }),
  updatedBy: one(User, {
    fields: [ProjectTask.updatedBy],
    references: [User.id],
  }),
}))
