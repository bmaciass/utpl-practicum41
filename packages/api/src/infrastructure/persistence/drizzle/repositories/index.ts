import type { Db } from '@sigep/db'
import { DrizzleAlignmentInstitutionalToPNDRepository } from './DrizzleAlignmentInstitutionalToPNDRepository'
import { DrizzleAlignmentPNDToODSRepository } from './DrizzleAlignmentPNDToODSRepository'
import { DrizzleIndicatorRepository } from './DrizzleIndicatorRepository'
import { DrizzleInstitutionRepository } from './DrizzleInstitutionRepository'
import { DrizzleInstitutionalObjectiveRepository } from './DrizzleInstitutionalObjectiveRepository'
import { DrizzleInstitutionalPlanRepository } from './DrizzleInstitutionalPlanRepository'
import { DrizzleObjectiveODSRepository } from './DrizzleObjectiveODSRepository'
import { DrizzleObjectivePNDRepository } from './DrizzleObjectivePNDRepository'
import { DrizzlePersonRepository } from './DrizzlePersonRepository'
import { DrizzleProgramRepository } from './DrizzleProgramRepository'
import { DrizzleProjectRepository } from './DrizzleProjectRepository'
import { DrizzleProjectTaskRepository } from './DrizzleProjectTaskRepository'
import { DrizzleRoleRepository } from './DrizzleRoleRepository'
import { DrizzleUserRepository } from './DrizzleUserRepository'
import { GoalRepository } from './GoalRepository'

export * from './GoalRepository'

export const getInstitutionRepository = (db: Db) =>
  new DrizzleInstitutionRepository(db)

export const getInstitutionalObjectiveRepository = (db: Db) =>
  new DrizzleInstitutionalObjectiveRepository(db)

export const getInstitutionalPlanRepository = (db: Db) =>
  new DrizzleInstitutionalPlanRepository(db)

export const getObjectiveODSRepository = (db: Db) =>
  new DrizzleObjectiveODSRepository(db)

export const getObjectivePNDRepository = (db: Db) =>
  new DrizzleObjectivePNDRepository(db)

export const getPersonRepository = (db: Db) => new DrizzlePersonRepository(db)

export const getProgramRepository = (db: Db) => new DrizzleProgramRepository(db)

export const getProjectRepository = (db: Db) => new DrizzleProjectRepository(db)

export const getProjectTasksRepository = (db: Db) =>
  new DrizzleProjectTaskRepository(db)

export const getUserRepository = (db: Db) => new DrizzleUserRepository(db)

export const getRoleRepository = (db: Db) => new DrizzleRoleRepository(db)

export const getAlignmentInstitutionalToPNDRepository = (db: Db) =>
  new DrizzleAlignmentInstitutionalToPNDRepository(db)

export const getAlignmentPNDToODSRepository = (db: Db) =>
  new DrizzleAlignmentPNDToODSRepository(db)

export const getIndicatorRepository = (db: Db) =>
  new DrizzleIndicatorRepository(db)

export function getGoalRepository(db: Db) {
  return new GoalRepository(db)
}
