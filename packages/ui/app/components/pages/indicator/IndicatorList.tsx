import type { Indicator_UseIndicatorListQuery } from '~/gql/graphql'
import { IndicatorCard } from './IndicatorCard'

type IndicatorRecord =
  Indicator_UseIndicatorListQuery['indicator']['list']['records'][number]

export function IndicatorList(props: {
  list: IndicatorRecord[]
  goalUid: string
  institutionUid: string
  objectiveUid: string
}) {
  const { list, goalUid, institutionUid, objectiveUid } = props

  return (
    <div className='flex flex-col gap-2'>
      {list.map((indicator) => (
        <IndicatorCard
          key={indicator.uid}
          indicator={indicator}
          goalUid={goalUid}
          institutionUid={institutionUid}
          objectiveUid={objectiveUid}
        />
      ))}
    </div>
  )
}
