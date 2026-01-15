import { type Db, ObjectiveODS } from '@sigep/db'
import { nanoid } from 'nanoid/non-secure'

export async function seedODSObjectives(db: Db, userId: number) {
  const odsData = [
    {
      name: 'ODS 1: Fin de la pobreza',
      description:
        'Poner fin a la pobreza en todas sus formas en todo el mundo',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 2: Hambre cero',
      description:
        'Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición y promover la agricultura sostenible',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 3: Salud y bienestar',
      description:
        'Garantizar una vida sana y promover el bienestar para todos en todas las edades',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 4: Educación de calidad',
      description:
        'Garantizar una educación inclusiva, equitativa y de calidad y promover oportunidades de aprendizaje durante toda la vida para todos',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 5: Igualdad de género',
      description:
        'Lograr la igualdad entre los géneros y empoderar a todas las mujeres y las niñas',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 6: Agua limpia y saneamiento',
      description:
        'Garantizar la disponibilidad de agua y su gestión sostenible y el saneamiento para todos',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 7: Energía asequible y no contaminante',
      description:
        'Garantizar el acceso a una energía asequible, segura, sostenible y moderna para todos',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 8: Trabajo decente y crecimiento económico',
      description:
        'Promover el crecimiento económico sostenido, inclusivo y sostenible, el empleo pleno y productivo y el trabajo decente para todos',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 9: Industria, innovación e infraestructura',
      description:
        'Construir infraestructuras resilientes, promover la industrialización inclusiva y sostenible y fomentar la innovación',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 10: Reducción de las desigualdades',
      description: 'Reducir la desigualdad en y entre los países',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 11: Ciudades y comunidades sostenibles',
      description:
        'Lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 12: Producción y consumo responsables',
      description: 'Garantizar modalidades de consumo y producción sostenibles',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 13: Acción por el clima',
      description:
        'Adoptar medidas urgentes para combatir el cambio climático y sus efectos',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 14: Vida submarina',
      description:
        'Conservar y utilizar en forma sostenible los océanos, los mares y los recursos marinos para el desarrollo sostenible',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 15: Vida de ecosistemas terrestres',
      description:
        'Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres, gestionar sosteniblemente los bosques, luchar contra la desertificación, detener e invertir la degradación de las tierras y detener la pérdida de biodiversidad',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 16: Paz, justicia e instituciones sólidas',
      description:
        'Promover sociedades pacíficas e inclusivas para el desarrollo sostenible, facilitar el acceso a la justicia para todos y construir a todos los niveles instituciones eficaces e inclusivas que rindan cuentas',
      uid: nanoid(),
      createdBy: userId,
    },
    {
      name: 'ODS 17: Alianzas para lograr los objetivos',
      description:
        'Fortalecer los medios de implementación y revitalizar la Alianza Mundial para el Desarrollo Sostenible',
      uid: nanoid(),
      createdBy: userId,
    },
  ]

  await db.insert(ObjectiveODS).values(odsData)
}
