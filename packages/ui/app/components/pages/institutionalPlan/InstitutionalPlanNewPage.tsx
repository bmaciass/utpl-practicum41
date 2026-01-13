import { useParams } from '@remix-run/react'
import { InstitutionalPlanForm } from './InstitutionalPlanForm'

export const InstitutionalPlanNewPage = () => {
  const { institutionUid } = useParams()

  return <InstitutionalPlanForm institutionUid={institutionUid!} />
}
