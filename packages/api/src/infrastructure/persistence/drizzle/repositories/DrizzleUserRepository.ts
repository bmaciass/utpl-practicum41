import type { Db } from '@sigep/db'
import { User as UserTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, isNotNull, isNull, like } from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type {
  FindManyUsersOptions,
  IUserRepository,
  UserFilters,
} from '~/domain/repositories/IUserRepository'
import type { User } from '../../../../domain/entities/User'
import { UserPersistenceMapper } from '../mappers/UserPersistenceMapper'

export class DrizzleUserRepository implements IUserRepository {
  constructor(private db: Db) {}

  async findById(id: number): Promise<User | null> {
    const record = await this.db.query.User.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? UserPersistenceMapper.toDomain(record) : null
  }

  async findByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) return []

    const records = await this.db.query.User.findMany({
      where: (fields, ops) => ops.inArray(fields.id, ids),
    })

    return records.map((record) => UserPersistenceMapper.toDomain(record))
  }

  async findByUid(uid: string): Promise<User | null> {
    const record = await this.db.query.User.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? UserPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<User> {
    const user = await this.findByUid(uid)
    if (!user) {
      throw NotFoundError.forEntity('User', uid)
    }
    return UserPersistenceMapper.toDomain(user)
  }

  async findByName(name: string): Promise<User | null> {
    const record = await this.db.query.User.findFirst({
      where: (fields, ops) => ops.eq(fields.name, name),
    })
    return record ? UserPersistenceMapper.toDomain(record) : null
  }

  async findByPersonId(personId: number): Promise<User | null> {
    const record = await this.db.query.User.findFirst({
      where: (fields, ops) => ops.eq(fields.personId, personId),
    })
    return record ? UserPersistenceMapper.toDomain(record) : null
  }

  async findMany(options?: FindManyUsersOptions): Promise<User[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.User.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(UserPersistenceMapper.toDomain)
  }

  async save(user: User): Promise<User> {
    const data = UserPersistenceMapper.toPersistence(user)

    if (user.isNew) {
      const [inserted] = await this.db
        .insert(UserTable)
        .values(data)
        .returning()
      return UserPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(UserTable)
      .set(data)
      .where(eq(UserTable.uid, user.uid))
      .returning()
    return UserPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(UserTable).where(eq(UserTable.uid, uid))
  }

  private buildFilters(where?: UserFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(UserTable.deletedAt)
          : isNotNull(UserTable.deletedAt)
        : null,
      where.name ? like(UserTable.name, `%${where.name}%`) : null,
    ])
  }
}
