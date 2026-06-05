import { useNavigate, useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { IndicatorListSection } from '~/components/pages/indicator/IndicatorListSection'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useRegisterBreadcrumbName } from '~/context/BreadcrumbNames'
import { withAuth } from '~/helpers/withAuth'
import { useGetGoal } from '~/hooks/goal/useGetGoal'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

function SelectedGoalPanel() {
  const { institutionUid, objectiveUid, selectedGoalUid } = useParams()
  const navigate = useNavigate()

  if (!institutionUid || !objectiveUid || !selectedGoalUid) {
    return <Alert variant='error' description='Parametros no encontrados' />
  }

  const { goal, loading, error } = useGetGoal(selectedGoalUid)
  useRegisterBreadcrumbName(selectedGoalUid, goal?.name)

  if (loading) return <Skeleton className='h-64 w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando la meta. Error: ${
          error.cause?.message ?? error.message
        }`}
      />
    )
  }

  if (!goal) {
    return <Alert variant='error' description='Meta no encontrada' />
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-2'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Title variant='h4'>{goal.name}</Title>
            <Badge variant={goal.active ? 'default' : 'secondary'}>
              {goal.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          {goal.description && (
            <Paragraph className='text-muted-foreground'>
              {goal.description}
            </Paragraph>
          )}
        </div>
        <Button
          variant='outline'
          onClick={() =>
            navigate(
              `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${selectedGoalUid}`,
            )
          }
        >
          Editar meta
        </Button>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Title variant='h4'>Indicadores</Title>
          <Button
            size='sm'
            onClick={() =>
              navigate(
                `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${selectedGoalUid}/indicator/new`,
              )
            }
          >
            Nuevo indicador
          </Button>
        </div>
        <IndicatorListSection
          goalUid={selectedGoalUid}
          institutionUid={institutionUid}
          objectiveUid={objectiveUid}
        />
      </div>
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <SelectedGoalPanel />}</ClientOnly>
}
