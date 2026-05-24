import { relations } from 'drizzle-orm'
import { Institution } from '../tables/institution'
import { InstitutionalEstrategicObjetive } from '../tables/institutionalEstrategicObjetive'
import { Program } from '../tables/program'
import { User } from '../tables/user'

export const institutionRelations = relations(Institution, ({ one, many }) => ({
  objetives: many(InstitutionalEstrategicObjetive),
  programs: many(Program),
  createdBy: one(User, {
    fields: [Institution.createdBy],
    references: [User.id],
  }),
  updatedBy: one(User, {
    fields: [Institution.updatedBy],
    references: [User.id],
  }),
}))
