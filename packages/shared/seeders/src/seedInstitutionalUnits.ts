import { type Db, institutionalUnit } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedInstitutionalUnits(
  db: Db,
  userId: number,
  institutionId: number,
) {
  const units = [
    {
      name: 'Rectorado',
    },
    {
      name: 'Vicerrectorado Academico',
    },
    {
      name: 'Vicerrectorado de Investigacion',
    },
    {
      name: 'Direccion Administrativa',
    },
    {
      name: 'Bienestar Universitario',
    },
    {
      name: 'Tecnologias de la Informacion',
    },
  ].map((unit) => ({
    ...unit,
    uid: nanoid(),
    institutionId,
    createdBy: userId,
  }))

  await db.insert(institutionalUnit).values(units)
}
