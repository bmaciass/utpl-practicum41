import { type Db, InstitutionalPlan } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedInstitutionalPlans(
  db: Db,
  adminUserId: number,
  institutionId: number,
) {
  await db.insert(InstitutionalPlan).values([
    {
      name: 'Plan Institucional 2024',
      description:
        'Lineamientos base para ordenar proyectos prioritarios, cobertura y aseguramiento de la calidad.',
      year: 2024,
      url: 'https://example.com/plan-institucional-2024',
      institutionId,
      uid: nanoid(),
      createdBy: adminUserId,
    },
    {
      name: 'Plan Institucional 2025',
      description:
        'Hoja de ruta para consolidar transformacion digital, analitica institucional y vinculación territorial.',
      year: 2025,
      url: 'https://example.com/plan-institucional-2025',
      institutionId,
      uid: nanoid(),
      createdBy: adminUserId,
    },
    {
      name: 'Plan Institucional 2026',
      description:
        'Plan de continuidad orientado a innovación, internacionalización y sostenibilidad operativa.',
      year: 2026,
      url: 'https://example.com/plan-institucional-2026',
      institutionId,
      uid: nanoid(),
      createdBy: adminUserId,
    },
  ])
}
