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
  programIds: Record<string, number>
  userIds: Record<string, number>
}> {
  const people = await db
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
      {
        firstName: 'Maria',
        lastName: 'Salazar',
        dni: '0912456789',
        uid: nanoid(),
      },
      {
        firstName: 'Luis',
        lastName: 'Mendoza',
        dni: '0923344556',
        uid: nanoid(),
      },
      {
        firstName: 'Ana',
        lastName: 'Vega',
        dni: '0955566677',
        uid: nanoid(),
      },
      {
        firstName: 'Sofia',
        lastName: 'Jaramillo',
        dni: '0966677788',
        uid: nanoid(),
      },
    ])
    .returning()

  const personByDni = new Map(people.map((person) => [person.dni, person]))

  const credentials = {
    admin: new PasswordService().hashPassword('admin'),
    bryan: new PasswordService().hashPassword('bryan'),
    maria: new PasswordService().hashPassword('maria'),
    luis: new PasswordService().hashPassword('luis'),
    ana: new PasswordService().hashPassword('ana'),
    sofia: new PasswordService().hashPassword('sofia'),
  }

  const users = await db
    .insert(User)
    .values([
      {
        name: 'admin',
        password: credentials.admin.hash,
        salt: credentials.admin.salt,
        uid: nanoid(),
        personId: personByDni.get('0999999999')!.id,
      },
      {
        name: 'bryan',
        password: credentials.bryan.hash,
        salt: credentials.bryan.salt,
        uid: nanoid(),
        personId: personByDni.get('0931478093')!.id,
      },
      {
        name: 'maria',
        password: credentials.maria.hash,
        salt: credentials.maria.salt,
        uid: nanoid(),
        personId: personByDni.get('0912456789')!.id,
      },
      {
        name: 'luis',
        password: credentials.luis.hash,
        salt: credentials.luis.salt,
        uid: nanoid(),
        personId: personByDni.get('0923344556')!.id,
      },
      {
        name: 'ana',
        password: credentials.ana.hash,
        salt: credentials.ana.salt,
        uid: nanoid(),
        personId: personByDni.get('0955566677')!.id,
      },
      {
        name: 'sofia',
        password: credentials.sofia.hash,
        salt: credentials.sofia.salt,
        uid: nanoid(),
        personId: personByDni.get('0966677788')!.id,
      },
    ])
    .returning()

  const userByName = new Map(users.map((user) => [user.name, user]))
  const userAdmin = userByName.get('admin')!

  const roles = await db
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
      {
        name: 'coordinador',
        uid: nanoid(),
        createdBy: userAdmin.id,
      },
      {
        name: 'analista',
        uid: nanoid(),
        createdBy: userAdmin.id,
      },
    ])
    .returning()

  const roleByName = new Map(roles.map((role) => [role.name, role]))

  await db.insert(UserRole).values([
    {
      userId: userByName.get('admin')!.id,
      roleId: roleByName.get('admin')!.id,
      createdBy: userAdmin.id,
    },
    {
      userId: userByName.get('bryan')!.id,
      roleId: roleByName.get('operador')!.id,
      createdBy: userAdmin.id,
    },
    {
      userId: userByName.get('maria')!.id,
      roleId: roleByName.get('coordinador')!.id,
      createdBy: userAdmin.id,
    },
    {
      userId: userByName.get('luis')!.id,
      roleId: roleByName.get('analista')!.id,
      createdBy: userAdmin.id,
    },
    {
      userId: userByName.get('ana')!.id,
      roleId: roleByName.get('coordinador')!.id,
      createdBy: userAdmin.id,
    },
    {
      userId: userByName.get('sofia')!.id,
      roleId: roleByName.get('operador')!.id,
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

  const programs = await db
    .insert(Program)
    .values([
      {
        createdBy: userAdmin.id,
        name: 'Programa de Transformacion digital',
        description:
          'Modernizacion de plataformas, datos, interoperabilidad y experiencia de servicios institucionales.',
        institutionId: institution.id,
        responsibleId: userByName.get('maria')!.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-12-31'),
        estimatedInversion: 450000,
        uid: nanoid(),
      },
      {
        createdBy: userAdmin.id,
        name: 'Programa de Permanencia Estudiantil',
        description:
          'Intervenciones para permanencia, acompañamiento oportuno y cierre de brechas de riesgo estudiantil.',
        institutionId: institution.id,
        responsibleId: userByName.get('ana')!.id,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-06-30'),
        estimatedInversion: 280000,
        uid: nanoid(),
      },
      {
        createdBy: userAdmin.id,
        name: 'Programa de Innovacion y Vinculacion',
        description:
          'Articulacion de proyectos aplicados, transferencia y trabajo conjunto con territorio y sector productivo.',
        institutionId: institution.id,
        responsibleId: userByName.get('sofia')!.id,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2026-12-31'),
        estimatedInversion: 320000,
        uid: nanoid(),
      },
    ])
    .returning()

  const programByName = new Map(
    programs.map((program) => [program.name, program]),
  )

  return {
    adminUserId: userByName.get('admin')!.id,
    institutionId: institution.id,
    programIds: {
      'transformacion-digital': programByName.get(
        'Programa de Transformacion digital',
      )!.id,
      'permanencia-estudiantil': programByName.get(
        'Programa de Permanencia Estudiantil',
      )!.id,
      'innovacion-vinculacion': programByName.get(
        'Programa de Innovacion y Vinculacion',
      )!.id,
    },
    userIds: Object.fromEntries(
      Array.from(userByName.entries()).map(([name, user]) => [name, user.id]),
    ),
  }
}

async function main() {
  const directDatabaseUrl = process.env.DIRECT_DATABASE_URL

  if (!directDatabaseUrl) {
    throw new Error('DIRECT_DATABASE_URL is not defined')
  }

  const { db, client } = await getDBConnection(directDatabaseUrl)

  await client.connect()

  await db.transaction(async (tx) => {
    await recreatePublicSchema(tx)
    await executeMigration(tx)
    const { adminUserId, institutionId, programIds, userIds } =
      await seedOrganizationData(tx)
    await seedInstitutionalPlans(tx, adminUserId, institutionId)
    await seedInstitutionalUnits(tx, adminUserId, institutionId)
    await seedInstitutionalClassifications(tx, adminUserId)
    await seedPermissionRoles(tx, adminUserId)
    await seedProjects(tx, adminUserId, userIds, programIds)
    await seedODSObjectives(tx, adminUserId)
    await seedProjectObjectiveODSAlignment(tx, adminUserId)
    await seedPNDObjectives(tx, adminUserId)
    await seedPNDODSAlignment(tx, adminUserId)
    await seedInstitutionalObjectives(tx, adminUserId, institutionId)
    await seedAlignmentStrategicPND(tx, adminUserId)
    await seedGoals(tx, adminUserId, institutionId)
    await seedIndicators(tx, adminUserId, institutionId, userIds)
  })
  await client.end()
}

console.log(`Running local seed in ${process.env.DIRECT_DATABASE_URL}`)

main()
  .then(() => {
    console.log('seeder finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
