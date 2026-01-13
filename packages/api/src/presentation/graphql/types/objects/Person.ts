import type { PersonRecord } from '@sigep/db'
import { isNil } from 'lodash-es'
import builder from '../../schema/builder'

export type TPerson = Pick<
  PersonRecord,
  'uid' | 'firstName' | 'lastName' | 'dni' | 'deletedAt'
>

export const Person = builder.objectRef<TPerson>('Person').implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    dni: t.exposeString('dni'),
    active: t.field({
      type: 'Boolean',
      resolve: (person) => isNil(person.deletedAt),
    }),
  }),
})
