import { useNavigate } from '@remix-run/react'
import { capitalize } from 'lodash-es'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import type { GetUsers_UseUserListQuery } from '~/gql/graphql'

export const UserCard = (data: {
  user: GetUsers_UseUserListQuery['user']['list']['records'][number]
}) => {
  const { uid, name } = data.user
  const navigate = useNavigate()

  const handleOnClick = (userUid: string) => {
    navigate(`/users/${userUid}`)
  }

  return (
    <Card
      className='cursor-pointer'
      key={`user-${uid}`}
      onClick={() => {
        handleOnClick(uid)
      }}
    >
      <CardHeader>
        <CardTitle>{capitalize(name)}</CardTitle>
      </CardHeader>
    </Card>
  )
}
