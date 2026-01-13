import { pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core'
import {
  byColumns,
  deletedAtColumn,
  idColumn,
  timestampColumns,
} from '../../helpers/column.helpers'

export const institutionAreaEnum = pgEnum('InstitutionArea', ['educacion'])
export const institutionGovernanceLevelEnum = pgEnum(
  'InstitutionGovernanceLevel',
  ['nacional'],
)

export const Institution = pgTable('Institution', {
  ...idColumn,
  name: varchar({ length: 128 }).notNull(),
  uid: varchar({ length: 64 }).unique().notNull(),
  area: institutionAreaEnum().notNull(),
  level: institutionGovernanceLevelEnum().notNull(),
  ...deletedAtColumn,
  ...byColumns,
  ...timestampColumns,
})

// export const institutionRelations = relations(Institution, ({ one }) => ({
//   createdBy: one(User, { fields: [Institution.createdBy], references: [User.id] }),
//   updatedBy: one(User, { fields: [Institution.updatedBy], references: [User.id] }),
// }))

export type InstitutionPayload = typeof Institution.$inferInsert
export type InstitutionRecord = typeof Institution.$inferSelect
