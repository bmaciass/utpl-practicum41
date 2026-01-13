import type { UserRecord } from '@sigep/db'
import { isNil } from 'lodash-es'
import builder from '../../schema/builder'
import { Person } from './Person'

export type TUser = Pick<UserRecord, 'uid' | 'name' | 'deletedAt' | 'personId'>

export const User = builder.objectRef<TUser>('User').implement({
  fields: (t) => ({
    uid: t.exposeID('uid'),
    name: t.exposeString('name'),
    person: t.field({
      type: Person,
      nullable: false,
      resolve: (user, _, { loaders }) => {
        return loaders.person.load(user.personId)
      },
    }),
    active: t.field({
      type: 'Boolean',
      resolve: (user) => isNil(user.deletedAt),
    }),
  }),
})
