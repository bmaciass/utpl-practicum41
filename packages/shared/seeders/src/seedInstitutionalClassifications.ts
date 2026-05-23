import { type Db, institutionalClassification } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedInstitutionalClassifications(db: Db, userId: number) {
  const parents = [
    {
      name: 'Academico',
      code: 'ACAD',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Investigacion',
      code: 'INV',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Administrativo',
      code: 'ADM',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Tecnologia',
      code: 'TEC',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Vinculacion',
      code: 'VIN',
      uid: nanoid(),
      createdBy: userId,
    },
  ]

  const insertedParents = await db
    .insert(institutionalClassification)
    .values(parents)
    .returning()

  const parentByCode = new Map(
    insertedParents.map((parent) => [parent.code, parent.id]),
  )

  const children = [
    {
      name: 'Pregrado',
      code: 'ACAD-PRE',
      parentId: parentByCode.get('ACAD'),
    },
    {
      name: 'Posgrado',
      code: 'ACAD-POS',
      parentId: parentByCode.get('ACAD'),
    },
    {
      name: 'Proyectos Aplicados',
      code: 'INV-AP',
      parentId: parentByCode.get('INV'),
    },
    {
      name: 'Publicaciones',
      code: 'INV-PUB',
      parentId: parentByCode.get('INV'),
    },
    {
      name: 'Talento Humano',
      code: 'ADM-TH',
      parentId: parentByCode.get('ADM'),
    },
    {
      name: 'Finanzas',
      code: 'ADM-FIN',
      parentId: parentByCode.get('ADM'),
    },
    {
      name: 'Infraestructura Digital',
      code: 'TEC-INF',
      parentId: parentByCode.get('TEC'),
    },
    {
      name: 'Analitica Institucional',
      code: 'TEC-ANA',
      parentId: parentByCode.get('TEC'),
    },
    {
      name: 'Territorio',
      code: 'VIN-TERR',
      parentId: parentByCode.get('VIN'),
    },
    {
      name: 'Practicas y Servicio',
      code: 'VIN-PS',
      parentId: parentByCode.get('VIN'),
    },
  ].map((child) => ({
    ...child,
    uid: nanoid(),
    createdBy: userId,
  }))

  await db.insert(institutionalClassification).values(children)
}
