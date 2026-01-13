import { Separator } from '~/components/ui/separator'
import type { GetInstitutionalPlans_UseInstitutionalPlanListQuery } from '~/gql/graphql'
import { InstitutionalPlanCard } from './InstitutionalPlanCard'

export const InstitutionalPlanList = (props: {
  list: GetInstitutionalPlans_UseInstitutionalPlanListQuery['institutionalPlan']['list']['records']
  institutionUid: string
}) => {
  const { list, institutionUid } = props
  const shallowClonedList = [...list]

  const firstRecord = shallowClonedList.shift()
  if (!firstRecord) return null

  const institutionalPlanList = shallowClonedList.map((record) => {
    return (
      <>
        <Separator key={`separator-${record.uid}`} />
        <InstitutionalPlanCard
          key={`${record.uid}`}
          institutionalPlan={record}
          institutionUid={institutionUid}
        />
      </>
    )
  })

  institutionalPlanList.unshift(
    <InstitutionalPlanCard
      key={firstRecord.uid}
      institutionalPlan={firstRecord}
      institutionUid={institutionUid}
    />,
  )

  return <>{institutionalPlanList}</>
}