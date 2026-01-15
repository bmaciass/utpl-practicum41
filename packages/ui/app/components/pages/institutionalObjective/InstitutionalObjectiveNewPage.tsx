import { useParams } from '@remix-run/react'
import { InstitutionalObjectiveForm } from './InstitutionalObjectiveForm'

export const InstitutionalObjectiveNewPage = () => {
  const { institutionUid } = useParams()

  return <InstitutionalObjectiveForm institutionUid={institutionUid!} />
}
