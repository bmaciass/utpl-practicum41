import { relations } from 'drizzle-orm/relations'
import { Institution } from '../tables/institution'
import { InstitutionalEstrategicObjetive } from '../tables/institutionalEstrategicObjetive'
import { User } from '../tables/user'

export const estrategicObjetiveRelations = relations(
  InstitutionalEstrategicObjetive,
  ({ one }) => ({
    institution: one(Institution, {
      fields: [InstitutionalEstrategicObjetive.institutionId],
      references: [Institution.id],
    }),
    createdBy: one(User, {
      fields: [InstitutionalEstrategicObjetive.createdBy],
      references: [User.id],
    }),
    updatedBy: one(User, {
      fields: [InstitutionalEstrategicObjetive.updatedBy],
      references: [User.id],
    }),
  }),
)
