import { Link, Outlet, useNavigate, useParams } from '@remix-run/react'
import { useState } from 'react'
import { DetailHero } from '~/components/DetailHero'
import { Alert } from '~/components/globals/Alert'
import { GoalListSection } from '~/components/pages/goal/GoalListSection'
import { InstitutionalObjectiveAlignment } from '~/components/pages/institutionalObjective/InstitutionalObjectiveAlignment'
import { Title } from '~/components/typography/Headers'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { withAuth } from '~/helpers/withAuth'
import { useGetInstitutionalObjective } from '~/hooks/institutionalObjective/useGetInstitutionalObjective'
import { useUpdateInstitutionalObjective } from '~/hooks/institutionalObjective/useUpdateInstitutionalObjective'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

function ObjectiveDetailLayout() {
  const { institutionUid, objectiveUid } = useParams()
  const navigate = useNavigate()
  const [alignOpen, setAlignOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)

  if (!institutionUid || !objectiveUid) {
    return <Alert variant='error' description='Parametros no encontrados' />
  }

  const {
    institutionalObjective: objective,
    loading,
    error,
    refetch,
  } = useGetInstitutionalObjective(objectiveUid)
  const { update, loading: updating } =
    useUpdateInstitutionalObjective(institutionUid)

  const isActive = objective?.active ?? true

  const handleToggleActive = async () => {
    await update({
      variables: {
        where: { uid: objectiveUid },
        data: { active: !isActive },
      },
    })
    setToggleOpen(false)
    refetch()
  }

  return (
    <div className='p-4 space-y-6'>
      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}

      <DetailHero
        backTo={`/institutions/${institutionUid}/objectives`}
        title={objective?.name ?? ''}
        active={objective?.active}
        loading={loading}
        description={objective?.description}
        menuActions={[
          {
            label: 'Editar',
            onClick: () =>
              navigate(
                `/institutions/${institutionUid}/objectives/${objectiveUid}/edit`,
              ),
          },
          { label: 'Alinear', onClick: () => setAlignOpen(true) },
          {
            label: isActive ? 'Desactivar' : 'Activar',
            onClick: () => setToggleOpen(true),
            destructive: isActive,
          },
        ]}
        menuDisabled={updating || loading}
      />

      <div className='grid grid-cols-6 gap-4'>
        <div className='col-span-2 space-y-2'>
          <div className='flex items-center justify-between'>
            <Title variant='h4'>Metas</Title>
            <Link
              to={`/institutions/${institutionUid}/objectives/${objectiveUid}/goals/new`}
            >
              <Button size='sm'>Nueva</Button>
            </Link>
          </div>
          <GoalListSection
            institutionUid={institutionUid}
            objectiveUid={objectiveUid}
            cardTo={(goalUid) =>
              `/institutions/${institutionUid}/objectives/${objectiveUid}/goal/${goalUid}`
            }
          />
        </div>
        <div className='col-span-4'>
          <Outlet />
        </div>
      </div>

      <Dialog open={alignOpen} onOpenChange={setAlignOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Alinear objetivo institucional</DialogTitle>
          </DialogHeader>
          {objective && (
            <InstitutionalObjectiveAlignment
              institutionalObjectiveUid={objective.uid}
              objectiveName={objective.name}
              objectiveDescription={objective.description}
              onCancel={() => setAlignOpen(false)}
              onSaved={() => {
                setAlignOpen(false)
                refetch()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive ? 'Desactivar objetivo' : 'Activar objetivo'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isActive
                ? 'Esta accion marcara el objetivo como inactivo. Puedes reactivarlo luego.'
                : 'Esta accion reactivara el objetivo institucional.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleActive} disabled={updating}>
              {updating ? 'Procesando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <ObjectiveDetailLayout />}</ClientOnly>
}
