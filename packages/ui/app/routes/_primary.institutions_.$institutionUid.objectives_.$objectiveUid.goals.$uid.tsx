import { Link, useParams } from '@remix-run/react'
import { GoalForm } from '~/components/pages/goal/GoalForm'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { withAuth } from '~/helpers/withAuth'
import { useGetGoal } from '~/hooks/goal/useGetGoal'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

function GoalDetailInner() {
  const { institutionUid, objectiveUid, uid } = useParams()
  const { goal, loading, error } = useGetGoal(uid)

  if (!institutionUid || !objectiveUid || !uid) {
    return (
      <Alert variant='error' description='Parámetros inválidos para metas' />
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

  if (!goal) {
    return <Alert variant='error' description='Meta no encontrada' />
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <Title variant='h4'>{goal.name}</Title>
        <Link to='indicators'>
          <Button variant='secondary'>Indicadores</Button>
        </Link>
      </div>
      <GoalForm
        goal={goal}
        institutionUid={institutionUid}
        objectiveUid={objectiveUid}
      />
    </div>
  )
}

export default function GoalDetailRoute() {
  return <ClientOnly>{() => <GoalDetailInner />}</ClientOnly>
}
