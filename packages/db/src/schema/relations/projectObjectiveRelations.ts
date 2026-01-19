import { relations } from 'drizzle-orm/relations'
import { Project } from '../tables/project'
import { ProjectObjective } from '../tables/projectObjective'
import { User } from '../tables/user'

export const projectObjectiveRelations = relations(
  ProjectObjective,
  ({ one }) => ({
    project: one(Project, {
      fields: [ProjectObjective.projectId],
      references: [Project.id],
    }),
    createdBy: one(User, {
      fields: [ProjectObjective.createdBy],
      references: [User.id],
    }),
    updatedBy: one(User, {
      fields: [ProjectObjective.updatedBy],
      references: [User.id],
    }),
  }),
)
