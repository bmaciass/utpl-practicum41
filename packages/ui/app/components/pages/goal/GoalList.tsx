import type { Goal_UseGoalListQuery } from '~/gql/graphql'
import { GoalCard } from './GoalCard'

type GoalRecord = Goal_UseGoalListQuery['goal']['list']['records'][number]

export function GoalList(props: {
  list: GoalRecord[]
  institutionUid: string
  objectiveUid: string
}) {
  const { list, institutionUid, objectiveUid } = props

  return (
    <div className='flex flex-col gap-2'>
      {list.map((goal) => (
        <GoalCard
          key={goal.uid}
          goal={goal}
          institutionUid={institutionUid}
          objectiveUid={objectiveUid}
        />
      ))}
    </div>
  )
}
