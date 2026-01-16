import { useParams } from '@remix-run/react'
import { GoalForm } from '~/components/pages/goal/GoalForm'
import { Alert } from '~/components/globals/Alert'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const GoalNewInner = () => {
  const params = useParams()
  const institutionUid = params.institutionUid
  const objectiveUid = params.objectiveUid

  if (!institutionUid || !objectiveUid) {
    return <Alert variant='error' description='Parámetros inválidos para metas' />
  }

  return (
    <GoalForm institutionUid={institutionUid} objectiveUid={objectiveUid} />
  )
}

export default function GoalNewRoute() {
  return <ClientOnly>{() => <GoalNewInner />}</ClientOnly>
}
