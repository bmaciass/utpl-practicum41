import { useParams } from '@remix-run/react'
import { GoalForm } from '~/components/pages/goal/GoalForm'
import { Alert } from '~/components/globals/Alert'
import { Skeleton } from '~/components/ui/skeleton'
import { withAuth } from '~/helpers/withAuth'
import { useGetGoal } from '~/hooks/goal/useGetGoal'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

function GoalDetailInner() {
  const { institutionUid, objectiveUid, uid } = useParams()
  const { goal, loading, error } = useGetGoal(uid)

  if (!institutionUid || !objectiveUid || !uid) {
    return <Alert variant='error' description='Parámetros inválidos para metas' />
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

  if (!goal) {
    return <Alert variant='error' description='Meta no encontrada' />
  }

  return (
    <GoalForm
      goal={goal}
      institutionUid={institutionUid}
      objectiveUid={objectiveUid}
    />
  )
}

export default function GoalDetailRoute() {
  return <ClientOnly>{() => <GoalDetailInner />}</ClientOnly>
}
