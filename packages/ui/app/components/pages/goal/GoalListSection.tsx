import { isEmpty } from 'lodash-es'
import { useEffect, useState } from 'react'
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
  cardTo?: (goalUid: string) => string
}) {
  const { institutionUid, objectiveUid, onLoaded, cardTo } = props
  const { list, loading, error } = useGoalList(objectiveUid)
  const [visibleList, setVisibleList] = useState(list)

  useEffect(() => {
    if (list.length > 0) {
      setVisibleList(list)
      return
    }

    if (!loading) {
      setVisibleList([])
    }
  }, [list, loading])

  if (loading && isEmpty(visibleList)) {
    return <Skeleton className='h-full w-full' />
  }

  if (error && isEmpty(visibleList)) {
    return (
      <Alert
        variant='error'
        description={`Error cargando metas. Error: ${
          error.cause?.message ?? error.message
        }`}
      />
    )
  }

  if (isEmpty(visibleList)) {
    return <Paragraph>No hay metas creadas</Paragraph>
  }

  if (onLoaded) onLoaded(visibleList)

  return (
    <GoalList
      list={visibleList}
      institutionUid={institutionUid}
      objectiveUid={objectiveUid}
      cardTo={cardTo}
    />
  )
}
