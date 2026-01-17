import { type Db, InstitutionalPlan } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedInstitutionalPlans(
  db: Db,
  adminUserId: number,
  institutionId: number,
) {
  await db.insert(InstitutionalPlan).values({
    name: 'Plan Institucional 2024',
    description: 'Lineamientos base del plan institucional.',
    year: 2024,
    url: 'https://example.com/plan-institucional-2024',
    institutionId,
    uid: nanoid(),
    createdBy: adminUserId,
  })
}
