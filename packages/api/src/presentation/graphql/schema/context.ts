import type { Client, Db } from '@sigep/db'
import type { JWTAccessTokenPayload } from '~/helpers/session/types'
import type { createInstitutionLoader } from '../dataloaders/institutionLoader'
import type { createInstitutionalObjectiveLoader } from '../dataloaders/institutionalObjectiveLoader'
import type { createIndicatorsByGoalLoader } from '../dataloaders/indicatorsByGoalLoader'
import type { createPersonLoader } from '../dataloaders/personLoader'
import type { createProgramLoader } from '../dataloaders/programLoader'
import type { createProjectLoader } from '../dataloaders/projectLoader'
import type { createProjectObjectivesByProjectLoader } from '../dataloaders/projectObjectivesByProjectLoader'
import type { createProjectTasksByProjectLoader } from '../dataloaders/projectTasksByProjectLoader'
import type { createProjectByProgramLoader } from '../dataloaders/projectsByProgram'
import type { createUserLoader } from '../dataloaders/userLoader'

export type AppDataloaders = {
  institution: ReturnType<typeof createInstitutionLoader>
  institutionalObjective: ReturnType<typeof createInstitutionalObjectiveLoader>
  indicatorsByGoal: ReturnType<typeof createIndicatorsByGoalLoader>
  user: ReturnType<typeof createUserLoader>
  person: ReturnType<typeof createPersonLoader>
  program: ReturnType<typeof createProgramLoader>
  project: ReturnType<typeof createProjectLoader>
  projectObjectivesByProject: ReturnType<
    typeof createProjectObjectivesByProjectLoader
  >
  projectGoalsByProject: ReturnType<typeof createProjectTasksByProjectLoader>
  projectByProgramId: ReturnType<typeof createProjectByProgramLoader>
}

export type AppContext = {
  db: Db
  client: Client
  authenticated: boolean
  user: {
    uid: string
  }
  token: JWTAccessTokenPayload
  // DataLoaders for batching and caching entity fetches
  loaders: AppDataloaders
}
