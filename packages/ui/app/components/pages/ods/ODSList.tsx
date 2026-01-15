import { Separator } from '~/components/ui/separator'
import type { ObjectiveOds_UseOdsListQuery } from '~/gql/graphql'
import { ODSCard } from './ODSCard'

export const ODSList = (props: {
  list: ObjectiveOds_UseOdsListQuery['objectiveODS']['list']['records']
}) => {
  const { list } = props
  const shallowList = [...list]

  const firstRecord = shallowList.shift()
  if (!firstRecord) return null

  const odsList = shallowList.map((ods) => {
    return (
      <>
        <Separator key={`separator-${ods.uid}`} />
        <ODSCard key={`${ods.uid}`} ods={ods} />
      </>
    )
  })

  odsList.unshift(<ODSCard key={firstRecord.uid} ods={firstRecord} />)

  return <>{odsList}</>
}
