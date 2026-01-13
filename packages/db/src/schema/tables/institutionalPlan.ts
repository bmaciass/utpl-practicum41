import { integer, pgTable, smallint, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'
import { Institution } from './institution'

export const InstitutionalPlan = pgTable('InstitutionalPlan', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  year: smallint().notNull(),
  version: smallint().notNull(),
  url: varchar().notNull(),
  institutionId: integer()
    .references(() => Institution.id)
    .notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

// export const institutionalPlanRelations = relations(
//   InstitutionalPlan,
//   ({ one }) => ({
//     institution: one(Institution, {
//       fields: [InstitutionalPlan.institutionId],
//       references: [Institution.uid],
//     }),
//     createdBy: one(User, {
//       fields: [InstitutionalPlan.createdBy],
//       references: [User.uid],
//     }),
//     updatedBy: one(User, {
//       fields: [InstitutionalPlan.updatedBy],
//       references: [User.uid],
//     }),
//   }),
// )

export type InstitutionalPlanPayload = typeof InstitutionalPlan.$inferInsert
export type InstitutionalPlanRecord = typeof InstitutionalPlan.$inferSelect
