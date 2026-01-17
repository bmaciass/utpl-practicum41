import { useParams } from '@remix-run/react'
import { Paragraph } from '~/components/typography/Paragraph'
import { InstitutionalPlanForm } from './InstitutionalPlanForm'

export const InstitutionalPlanNewPage = () => {
  const { institutionUid } = useParams()

  if (!institutionUid) return <Paragraph>Parametro no encontrado</Paragraph>

  return <InstitutionalPlanForm institutionUid={institutionUid} />
}
