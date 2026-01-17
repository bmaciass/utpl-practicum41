import { useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { IndicatorForm } from '~/components/pages/indicator/IndicatorForm'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const IndicatorNewInner = () => {
  const { institutionUid, objectiveUid, goalUid } = useParams()

  if (!institutionUid || !objectiveUid || !goalUid) {
    return (
      <Alert
        variant='error'
        description='Parámetros inválidos para indicador'
      />
    )
  }

  return (
    <IndicatorForm
      institutionUid={institutionUid}
      objectiveUid={objectiveUid}
      goalUid={goalUid}
    />
  )
}

export default function IndicatorNewRoute() {
  return <ClientOnly>{() => <IndicatorNewInner />}</ClientOnly>
}
