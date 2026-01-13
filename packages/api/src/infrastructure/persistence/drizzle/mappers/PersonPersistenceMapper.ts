import type { PersonPayload, PersonRecord } from '@sigep/db'
import { Person } from '~/domain/entities/Person'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PersonPersistenceMapper {
  static toDomain(record: PersonRecord): Person {
    return Person.reconstitute({
      id: record.id,
      uid: record.uid,
      firstName: record.firstName,
      lastName: record.lastName,
      dni: record.dni,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }

  static toPersistence(entity: Person): PersonPayload {
    return {
      uid: entity.uid,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dni: entity.dni,
      deletedAt: entity.deletedAt,
    }
  }
}
