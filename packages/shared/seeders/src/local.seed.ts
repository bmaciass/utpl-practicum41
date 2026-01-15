import { PasswordService } from '@sigep/api/src/infrastructure/services/PasswordService'
import {
  type Db,
  Institution,
  Person,
  Program,
  Project,
  ProjectTask,
  User,
  executeMigration,
  getDBConnection,
} from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'
import { seedInstitutionalObjectives } from './seedInstitutionalObjectives'
import { seedODSObjectives } from './seedODSObjectives'
import { seedPNDObjectives } from './seedPNDObjectives'
import { seedPNDODSAlignment } from './seedPNDODSAlignment'

async function recreatePublicSchema(db: Db) {
  await db.execute('DROP SCHEMA "public" CASCADE; CREATE SCHEMA "public";')
}

async function seedOrganizationData(
  db: Db,
): Promise<{ adminUserId: number; institutionId: number }> {
  const [adminPerson, opPerson] = await db
    .insert(Person)
    .values([
      {
        firstName: 'Local',
        lastName: 'Admin',
        dni: '0999999999',
        uid: nanoid(),
      },
      {
        firstName: 'Bryan',
        lastName: 'Macias',
        dni: '0931478093',
        uid: nanoid(),
      },
    ])
    .returning()

  const [
    { hash: hashUserAdmin, salt: saltUserAdmin },
    { hash: hashOPUser, salt: saltOPUser },
  ] = [
    new PasswordService().hashPassword('admin'),
    new PasswordService().hashPassword('bryan'),
  ]

  const [userAdmin, userOperative] = await db
    .insert(User)
    .values([
      {
        name: 'admin',
        password: hashUserAdmin,
        salt: saltUserAdmin,
        uid: nanoid(),
        personId: adminPerson.id,
      },
      {
        name: 'bryan',
        password: hashOPUser,
        salt: saltOPUser,
        uid: nanoid(),
        personId: opPerson.id,
      },
    ])
    .returning()

  const [institution] = await db
    .insert(Institution)
    .values({
      name: 'Institucion de prueba',
      area: 'educacion',
      level: 'nacional',
      uid: '123123123',
      createdBy: userAdmin.id,
    })
    .returning()

  const [program] = await db
    .insert(Program)
    .values({
      createdBy: userAdmin.id,
      name: 'Programa de Transformacion digital',
      responsibleId: userOperative.id,
      uid: nanoid(),
    })
    .returning()

  const [project] = await db
    .insert(Project)
    .values({
      name: 'Proyecto de levantamiento de datos',
      createdBy: userAdmin.id,
      responsibleId: userOperative.id,
      programId: program.id,
      uid: nanoid(),
    })
    .returning()

  await db.insert(ProjectTask).values({
    name: 'terminar el proyecto',
    createdBy: userAdmin.id,
    status: 'in_progress',
    projectId: project.id,
    responsibleId: userOperative.id,
    uid: nanoid(),
  })

  return { adminUserId: userAdmin.id, institutionId: institution.id }
}

async function main() {
  const { db, client } = await getDBConnection(
    process.env.DATABASE_URL as string,
  )

  await client.connect()

  await db.transaction(async (tx) => {
    await recreatePublicSchema(tx)
    await executeMigration(tx)
    const { adminUserId, institutionId } = await seedOrganizationData(tx)
    await seedODSObjectives(tx, adminUserId)
    await seedPNDObjectives(tx, adminUserId)
    await seedPNDODSAlignment(tx, adminUserId)
    await seedInstitutionalObjectives(tx, adminUserId, institutionId)
  })
  await client.end()
}

console.log(`Running local seed in ${process.env.DATABASE_URL}`)

main()
  .then(() => {
    console.log('seeder finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
