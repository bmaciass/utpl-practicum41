import type { Db } from '@sigep/db'
import type { IUnitOfWork } from '@sigep/shared'
import type { IPersonRepository } from '~/domain/repositories/IPersonRepository'
import type { IUserRepository } from '~/domain/repositories/IUserRepository'
import { DrizzlePersonRepository } from './repositories/DrizzlePersonRepository'
import { DrizzleUserRepository } from './repositories/DrizzleUserRepository'

// should unit of work receive optional repositories?

export interface TransactionRepositories {
  personRepository: IPersonRepository
  userRepository: IUserRepository
}

export class DrizzleUnitOfWork implements IUnitOfWork<TransactionRepositories> {
  constructor(private db: Db) {}

  async withTransaction<T>(
    work: (repos: TransactionRepositories) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (tx) => {
      const repos: TransactionRepositories = {
        personRepository: new DrizzlePersonRepository(tx),
        userRepository: new DrizzleUserRepository(tx),
      }
      return work(repos)
    })
  }
}
