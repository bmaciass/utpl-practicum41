import { Separator } from '~/components/ui/separator'
import type { GetUsers_UseUserListQuery } from '~/gql/graphql'
import { UserCard } from './UserCard'

export const UserList = (props: {
  list: GetUsers_UseUserListQuery['user']['list']['records']
}) => {
  const { list } = props
  const shallowClonedList = [...list]

  const firstRecord = shallowClonedList.shift()
  if (!firstRecord) return null

  const institutionList = shallowClonedList.map((record) => {
    return (
      <>
        <Separator key={`separator-${record.uid}`} />
        <UserCard key={`${record.uid}`} user={record} />
      </>
    )
  })

  institutionList.unshift(<UserCard key={firstRecord.uid} user={firstRecord} />)

  return <>{institutionList}</>
}
