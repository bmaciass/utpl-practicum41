import { isEmpty } from 'lodash-es'
import { Alert } from '~/components/globals/Alert'
import { Paragraph } from '~/components/typography/Paragraph'
import { Skeleton } from '~/components/ui/skeleton'
import type { Goal_UseGoalListQuery } from '~/gql/graphql'
import { useGoalList } from '~/hooks/goal/useGoalList'
import { GoalList } from './GoalList'

type GoalRecord = Goal_UseGoalListQuery['goal']['list']['records'][number]

export function GoalListSection(props: {
  institutionUid: string
  objectiveUid: string
  onLoaded?: (list: GoalRecord[]) => void
}) {
  const { institutionUid, objectiveUid, onLoaded } = props
  const { list, loading, error } = useGoalList(objectiveUid)

  if (loading) return <Skeleton className='h-full w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando metas. Error: ${
          error.cause?.message ?? error.message
        }`}
      />
    )
  }

  if (isEmpty(list)) {
    return <Paragraph>No hay metas creadas</Paragraph>
  }

  if (onLoaded) onLoaded(list)

  return (
    <GoalList
      list={list}
      institutionUid={institutionUid}
      objectiveUid={objectiveUid}
    />
  )
}
