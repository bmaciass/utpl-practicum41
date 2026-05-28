import { useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { IndicatorForm } from '~/components/pages/indicator/IndicatorForm'
import { Skeleton } from '~/components/ui/skeleton'
import { withAuth } from '~/helpers/withAuth'
import { useGetIndicator } from '~/hooks/indicator/useGetIndicator'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

function IndicatorDetailInner() {
  const { institutionUid, objectiveUid, goalUid, uid } = useParams()
  const { indicator, loading, error } = useGetIndicator(uid)

  if (!institutionUid || !objectiveUid || !goalUid || !uid) {
    return (
      <Alert
        variant='error'
        description='Parámetros inválidos para indicador'
      />
    )
  }

  if (loading) return <Skeleton className='h-24 w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={error.cause?.message ?? error.message}
      />
    )
  }

  if (!indicator) {
    return <Alert variant='error' description='Indicador no encontrado' />
  }

  return (
    <IndicatorForm
      indicator={indicator}
      institutionUid={institutionUid}
      objectiveUid={objectiveUid}
      goalUid={goalUid}
    />
  )
}

export default function IndicatorDetailRoute() {
  return <ClientOnly>{() => <IndicatorDetailInner />}</ClientOnly>
}
