import { type Db, InstitutionalEstrategicObjetive } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedInstitutionalObjectives(
  db: Db,
  userId: number,
  institutionId: number,
) {
  const objectives = [
    {
      name: 'Excelencia Académica',
      description:
        'Fortalecer la calidad académica mediante la actualización curricular, capacitación docente y la implementación de metodologías innovadoras de enseñanza-aprendizaje',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
    {
      name: 'Investigación e Innovación',
      description:
        'Promover la investigación científica y la innovación tecnológica que contribuya al desarrollo sostenible de la región y del país',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
    {
      name: 'Vinculación con la Sociedad',
      description:
        'Establecer alianzas estratégicas con el sector público, privado y comunitario para generar impacto positivo en el desarrollo social y económico',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
    {
      name: 'Gestión Institucional Eficiente',
      description:
        'Optimizar los procesos administrativos y financieros mediante la implementación de sistemas de gestión de calidad y transparencia',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
    {
      name: 'Internacionalización',
      description:
        'Fortalecer la proyección internacional de la institución a través de convenios, movilidad académica y programas de doble titulación',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
    {
      name: 'Bienestar Universitario',
      description:
        'Garantizar el bienestar integral de la comunidad universitaria mediante programas de salud, cultura, deporte y desarrollo personal',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
    {
      name: 'Sostenibilidad y Responsabilidad Ambiental',
      description:
        'Implementar políticas y prácticas que promuevan la sostenibilidad ambiental, el uso eficiente de recursos y la responsabilidad ecológica',
      uid: nanoid(),
      institutionId,
      createdBy: userId,
    },
  ]

  await db.insert(InstitutionalEstrategicObjetive).values(objectives)
}
