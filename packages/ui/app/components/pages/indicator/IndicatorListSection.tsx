import { isEmpty } from 'lodash-es'
import { Alert } from '~/components/globals/Alert'
import { Paragraph } from '~/components/typography/Paragraph'
import { Skeleton } from '~/components/ui/skeleton'
import type { Indicator_UseIndicatorListQuery } from '~/gql/graphql'
import { useIndicatorList } from '~/hooks/indicator/useIndicatorList'
import { IndicatorList } from './IndicatorList'

type IndicatorRecord =
  Indicator_UseIndicatorListQuery['indicator']['list']['records'][number]

export function IndicatorListSection(props: {
  goalUid: string
  institutionUid: string
  objectiveUid: string
  onLoaded?: (list: IndicatorRecord[]) => void
}) {
  const { goalUid, institutionUid, objectiveUid, onLoaded } = props
  const { list, loading, error } = useIndicatorList(goalUid)

  if (loading) return <Skeleton className='h-full w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando indicadores. Error: ${
          error.cause?.message ?? error.message
        }`}
      />
    )
  }

  if (isEmpty(list)) {
    return <Paragraph>No hay indicadores creados</Paragraph>
  }

  if (onLoaded) onLoaded(list)

  return (
    <IndicatorList
      list={list}
      goalUid={goalUid}
      institutionUid={institutionUid}
      objectiveUid={objectiveUid}
    />
  )
}
