import { Link, useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { InstitutionForm } from '~/components/pages/institution/InstitutionForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetInstitution } from '~/hooks/institution/useGetInstitution'
import { useUpdateInstitution } from '~/hooks/institution/useUpdateInstitution'

export default function Index() {
  const { uid } = useParams()
  if (!uid) {
    return <Alert variant='error' description='Parametro no encontrado' />
  }

  const { error, loading, institution } = useGetInstitution(uid)
  const { updateInstitution, loading: updating } = useUpdateInstitution()

  const handleDeactivate = async () => {
    await updateInstitution({
      variables: {
        where: { id: uid },
        data: { active: false },
      },
    })
  }

  return (
    <>
      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}
      {loading && <Skeleton className='w-full' />}
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <Link to={`/institutions/${uid}/plans`}>
            <Button type='button' variant={'link'}>
              Planes
            </Button>
          </Link>
          <Link to={`/institutions/${uid}/objectives`}>
            <Button type='button' variant={'link'}>
              Objetivos
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' disabled={updating}>
                {updating ? 'Desactivando...' : 'Desactivar'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desactivar institucion</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta accion marcara la institucion como inactiva. Puedes
                  reactivarla luego editandola.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeactivate}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <InstitutionForm institution={institution} />
      </div>
    </>
  )
}
