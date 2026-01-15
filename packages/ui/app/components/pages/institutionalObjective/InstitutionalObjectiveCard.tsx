import { useNavigate } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { InstitutionalObjectiveList_UseInstitutionalObjectiveListQuery } from '~/gql/graphql'

export const InstitutionalObjectiveCard = (data: {
  objective: InstitutionalObjectiveList_UseInstitutionalObjectiveListQuery['institutionalObjective']['list']['records'][number]
  institutionUid: string
}) => {
  const { uid, name, description, active } = data.objective
  const { institutionUid } = data
  const navigate = useNavigate()

  const handleOnClick = (uid: string) => {
    navigate(`/institutions/${institutionUid}/objectives/${uid}`)
  }

  return (
    <Card
      className='cursor-pointer'
      key={`institutional-objective-${uid}`}
      onClick={() => {
        handleOnClick(uid)
      }}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardContent>
        {description && (
          <p className='text-sm text-muted-foreground mb-2'>{description}</p>
        )}

        <div className='flex gap-2'>
          <Badge variant={active ? 'default' : 'secondary'}>
            {active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
