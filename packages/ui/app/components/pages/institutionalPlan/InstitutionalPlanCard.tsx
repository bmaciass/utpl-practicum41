import { useNavigate } from '@remix-run/react'
import { capitalize } from 'lodash-es'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import type { GetInstitutionalPlans_UseInstitutionalPlanListQuery } from '~/gql/graphql'

export const InstitutionalPlanCard = (data: {
  institutionalPlan: GetInstitutionalPlans_UseInstitutionalPlanListQuery['institutionalPlan']['list']['records'][number]
  institutionUid: string
}) => {
  const { uid, name, year, version } = data.institutionalPlan
  const { institutionUid } = data
  const navigate = useNavigate()

  const handleOnClick = (uid: string) => {
    navigate(`/institutions/${institutionUid}/plans/${uid}`)
  }

  return (
    <Card
      className='cursor-pointer'
      key={`institutional-plan-${uid}`}
      onClick={() => {
        handleOnClick(uid)
      }}
    >
      <CardHeader>
        <CardTitle>
          {capitalize(name)} - {year} (v{version})
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
