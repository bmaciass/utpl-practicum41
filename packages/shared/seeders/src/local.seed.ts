import { PasswordService } from '@sigep/api/src/infrastructure/services/PasswordService'
import {
  type Db,
  Institution,
  Person,
  Program,
  Project,
  ProjectGoal,
  User,
  executeMigration,
  getDBConnection,
} from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

async function recreatePublicSchema(db: Db) {
  await db.execute('DROP SCHEMA "public" CASCADE; CREATE SCHEMA "public";')
}

async function seedOrganizationData(db: Db) {
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

  await db.insert(Institution).values({
    name: 'Institucion de prueba',
    area: 'educacion',
    level: 'nacional',
    uid: '123123123',
    createdBy: userAdmin.id,
  })

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

  await db.insert(ProjectGoal).values({
    name: 'terminar el proyecto',
    createdBy: userAdmin.id,
    status: 'in_progress',
    projectId: project.id,
    uid: nanoid(),
  })
}

async function main() {
  const { db, client } = await getDBConnection(
    process.env.DATABASE_URL as string,
  )

  await client.connect()

  await db.transaction(async (tx) => {
    await recreatePublicSchema(tx)
    await executeMigration(tx)
    await seedOrganizationData(tx)
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
