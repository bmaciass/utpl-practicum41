import { PasswordService } from '@sigep/api/src/infrastructure/services/PasswordService'
import {
  type Db,
  Institution,
  Person,
  Program,
  Role,
  User,
  UserRole,
  executeMigration,
  getDBConnection,
} from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'
import { seedGoals } from './seedGoals'
import { seedIndicators } from './seedIndicators'
import { seedAlignmentStrategicPND } from './seedAlignmentStrategicPND'
import { seedInstitutionalClassifications } from './seedInstitutionalClassifications'
import { seedInstitutionalObjectives } from './seedInstitutionalObjectives'
import { seedInstitutionalPlans } from './seedInstitutionalPlans'
import { seedInstitutionalUnits } from './seedInstitutionalUnits'
import { seedODSObjectives } from './seedODSObjectives'
import { seedPNDODSAlignment } from './seedPNDODSAlignment'
import { seedPNDObjectives } from './seedPNDObjectives'
import { seedPermissionRoles } from './seedPermissionRoles'
import { seedProjects } from './seedProjects'
import { seedProjectObjectiveODSAlignment } from './seedProjectObjectiveODSAlignment'

async function recreatePublicSchema(db: Db) {
  await db.execute('DROP SCHEMA "public" CASCADE; CREATE SCHEMA "public";')
}

async function seedOrganizationData(db: Db): Promise<{
  adminUserId: number
  institutionId: number
  programId: number
  userOperativeId: number
}> {
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

  const [adminRole, operadorRole] = await db
    .insert(Role)
    .values([
      {
        name: 'admin',
        uid: nanoid(),
        createdBy: userAdmin.id,
      },
      {
        name: 'operador',
        uid: nanoid(),
        createdBy: userAdmin.id,
      },
    ])
    .returning()

  await db.insert(UserRole).values([
    {
      userId: userAdmin.id,
      roleId: adminRole.id,
      createdBy: userAdmin.id,
    },
    {
      userId: userOperative.id,
      roleId: operadorRole.id,
      createdBy: userAdmin.id,
    },
  ])

  const [institution] = await db
    .insert(Institution)
    .values({
      name: 'Viceministerio de Educacion Superior',
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

  return {
    adminUserId: userAdmin.id,
    institutionId: institution.id,
    programId: program.id,
    userOperativeId: userOperative.id,
  }
}

async function main() {
  const { db, client } = await getDBConnection(
    process.env.DATABASE_URL as string,
  )

  await client.connect()

  await db.transaction(async (tx) => {
    await recreatePublicSchema(tx)
    await executeMigration(tx)
    const { adminUserId, institutionId, programId, userOperativeId } =
      await seedOrganizationData(tx)
    await seedInstitutionalPlans(tx, adminUserId, institutionId)
    await seedInstitutionalUnits(tx, adminUserId, institutionId)
    await seedInstitutionalClassifications(tx, adminUserId)
    await seedPermissionRoles(tx, adminUserId)
    await seedProjects(tx, adminUserId, userOperativeId, programId)
    await seedODSObjectives(tx, adminUserId)
    await seedProjectObjectiveODSAlignment(tx, adminUserId)
    await seedPNDObjectives(tx, adminUserId)
    await seedPNDODSAlignment(tx, adminUserId)
    await seedInstitutionalObjectives(tx, adminUserId, institutionId)
    await seedAlignmentStrategicPND(tx, adminUserId)
    await seedGoals(tx, adminUserId, institutionId)
    await seedIndicators(tx, adminUserId, institutionId)
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
