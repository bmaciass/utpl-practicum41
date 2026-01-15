import { type Db, ObjectivePND } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedPNDObjectives(db: Db, userId: number) {
  const pndData = [
    {
      name: 'Objetivo 1: Bienestar social y calidad de vida',
      description:
        'Mejorar el bienestar social y la calidad de vida de la población, garantizando el goce efectivo de derechos y la reducción de desigualdades',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 2: Educación, cultura y vida activa',
      description:
        'Fortalecer las capacidades de la ciudadanía con acceso universal a educación de calidad inclusiva, acceso a espacios de intercambio cultural y a una vida activa',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 3: Estado seguro y derechos humanos',
      description:
        'Garantizar un Estado soberano, seguro y justo promoviendo la convivencia pacífica y el respeto a los derechos humanos',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 4: Desarrollo económico y empleo de calidad',
      description:
        'Impulsar el desarrollo económico que genere empleo de calidad y finanzas públicas sostenibles, inclusivas y equitativas',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 5: Producción e inversión con innovación',
      description:
        'Fortalecer la producción e inversión extranjera en sectores claves de la economía con innovación tecnológica y prácticas sostenibles',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 6: Recursos naturales y eficiencia energética',
      description:
        'Proteger el uso sostenible de los recursos naturales, la protección del medio ambiente, así como la optimización y eficiencia energética',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 7: Infraestructura sostenible y conectividad',
      description:
        'Promover el desarrollo de infraestructura sostenible y resiliente; y la conectividad física y digital, brindando condiciones para el crecimiento y desarrollo económico',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 8: Fortalecimiento institucional',
      description:
        'Fortalecer las instituciones públicas de manera eficiente, transparente y participativa',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'Objetivo 9: Resiliencia ante riesgos',
      description:
        'Fortalecer la capacidad de respuesta y resiliencia de las ciudades y comunidades ante riesgos de origen natural y antrópico',
      uid: nanoid(),
      createdBy: userId,
    },
  ]

  await db.insert(ObjectivePND).values(pndData)
}
