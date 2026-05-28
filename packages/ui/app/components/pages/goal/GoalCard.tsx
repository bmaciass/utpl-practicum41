import { useNavigate } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { Goal_UseGoalListQuery, Goal_UseGetGoalQuery } from '~/gql/graphql'

type GoalRecord =
  | Goal_UseGoalListQuery['goal']['list']['records'][number]
  | NonNullable<Goal_UseGetGoalQuery['goal']['one']>

export function GoalCard(props: {
  goal: GoalRecord
  institutionUid: string
  objectiveUid: string
  cardTo?: (goalUid: string) => string
}) {
  const { goal, institutionUid, objectiveUid, cardTo } = props
  const navigate = useNavigate()

  const target = cardTo
    ? cardTo(goal.uid)
    : `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goal.uid}`

  return (
    <Card
      className='cursor-pointer transition hover:border-primary'
      onClick={() => navigate(target)}
    >
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-base font-semibold'>{goal.name}</CardTitle>
          <Badge variant={goal.active ? 'default' : 'secondary'}>
            {goal.active ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {goal.description}
        </p>
      </CardContent>
    </Card>
  )
}
