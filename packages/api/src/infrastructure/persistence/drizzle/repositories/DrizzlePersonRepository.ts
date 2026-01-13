import type { Db } from '@sigep/db'
import { Person as PersonTable } from '@sigep/db'
import { NotFoundError } from '@sigep/shared'
import { type SQL, eq, isNotNull, isNull, like } from 'drizzle-orm'
import { compact, isNil } from 'lodash-es'
import type { Person } from '~/domain/entities/Person'
import type {
  FindManyPersonsOptions,
  IPersonRepository,
  PersonFilters,
} from '~/domain/repositories/IPersonRepository'
import { PersonPersistenceMapper } from '../mappers/PersonPersistenceMapper'

export class DrizzlePersonRepository implements IPersonRepository {
  constructor(private db: Db) {}

  async findByIds(ids: number[]): Promise<Person[]> {
    const records = await this.db.query.Person.findMany({
      where: (fields, operators) => operators.inArray(fields.id, ids),
    })

    return records.map((record) => PersonPersistenceMapper.toDomain(record))
  }

  async findById(id: number): Promise<Person | null> {
    const record = await this.db.query.Person.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    })
    return record ? PersonPersistenceMapper.toDomain(record) : null
  }

  async findByUid(uid: string): Promise<Person | null> {
    const record = await this.db.query.Person.findFirst({
      where: (fields, ops) => ops.eq(fields.uid, uid),
    })
    return record ? PersonPersistenceMapper.toDomain(record) : null
  }

  async findByUidOrThrow(uid: string): Promise<Person> {
    const person = await this.findByUid(uid)
    if (!person) {
      throw NotFoundError.forEntity('Person', uid)
    }
    return person
  }

  async findByDni(dni: string): Promise<Person | null> {
    const record = await this.db.query.Person.findFirst({
      where: (fields, ops) => ops.eq(fields.dni, dni),
    })
    return record ? PersonPersistenceMapper.toDomain(record) : null
  }

  async findMany(options?: FindManyPersonsOptions): Promise<Person[]> {
    const { where, pagination } = options ?? {}
    const filters = this.buildFilters(where)

    const records = await this.db.query.Person.findMany({
      where: filters.length > 0 ? (_, ops) => ops.and(...filters) : undefined,
      offset: pagination?.offset,
      limit: pagination?.limit,
    })

    return records.map(PersonPersistenceMapper.toDomain)
  }

  async save(person: Person): Promise<Person> {
    const data = PersonPersistenceMapper.toPersistence(person)

    if (person.isNew) {
      const [inserted] = await this.db
        .insert(PersonTable)
        .values(data)
        .returning()
      return PersonPersistenceMapper.toDomain(inserted)
    }
    const [updated] = await this.db
      .update(PersonTable)
      .set(data)
      .where(eq(PersonTable.uid, person.uid))
      .returning()
    return PersonPersistenceMapper.toDomain(updated)
  }

  async delete(uid: string): Promise<void> {
    await this.db.delete(PersonTable).where(eq(PersonTable.uid, uid))
  }

  private buildFilters(where?: PersonFilters): SQL[] {
    if (!where) return []

    return compact([
      !isNil(where.active)
        ? where.active
          ? isNull(PersonTable.deletedAt)
          : isNotNull(PersonTable.deletedAt)
        : null,
      where.firstName
        ? like(PersonTable.firstName, `%${where.firstName}%`)
        : null,
      where.lastName ? like(PersonTable.lastName, `%${where.lastName}%`) : null,
      where.dni ? eq(PersonTable.dni, where.dni) : null,
    ])
  }
}
