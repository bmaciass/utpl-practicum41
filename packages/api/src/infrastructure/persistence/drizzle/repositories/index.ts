import type { Db } from '@sigep/db'
import { DrizzleInstitutionRepository } from './DrizzleInstitutionRepository'
import { DrizzleInstitutionalPlanRepository } from './DrizzleInstitutionalPlanRepository'
import { DrizzlePersonRepository } from './DrizzlePersonRepository'
import { DrizzleProgramRepository } from './DrizzleProgramRepository'
import { DrizzleProjectRepository } from './DrizzleProjectRepository'
import { DrizzleProjectGoalRepository } from './DrizzleProjectGoalRepository'
import { DrizzleRoleRepository } from './DrizzleRoleRepository'
import { DrizzleUserRepository } from './DrizzleUserRepository'

export const getInstitutionRepository = (db: Db) =>
  new DrizzleInstitutionRepository(db)

export const getInstitutionalPlanRepository = (db: Db) =>
  new DrizzleInstitutionalPlanRepository(db)

export const getPersonRepository = (db: Db) => new DrizzlePersonRepository(db)

export const getProgramRepository = (db: Db) => new DrizzleProgramRepository(db)

export const getProjectRepository = (db: Db) => new DrizzleProjectRepository(db)

export const getProjectGoalRepository = (db: Db) =>
  new DrizzleProjectGoalRepository(db)

export const getUserRepository = (db: Db) => new DrizzleUserRepository(db)

export const getRoleRepository = (db: Db) => new DrizzleRoleRepository(db)
