import { Link, useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { ProgramForm } from '~/components/pages/program/ProgramForm'
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
import { useGetProgram } from '~/hooks/program/useGetProgram'
import { useUpdateProgram } from '~/hooks/program/useUpdateProgram'

export default function Index() {
  const { programUid } = useParams()
  if (!programUid) {
    return <Alert variant='error' description='Parametro no encontrado' />
  }

  const { error, loading, program } = useGetProgram(programUid)
  const { updateProgram, loading: updatingProgram } = useUpdateProgram()

  const handleDeactivate = async () => {
    await updateProgram({
      variables: {
        where: { id: programUid },
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
      <div className='flex flex-col w-full'>
        <div className='flex gap-2'>
          <Link to={`/programs/${programUid}/projects`}>
            <Button type='button' variant={'link'}>
              Ver Proyectos
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' disabled={updatingProgram}>
                {updatingProgram ? 'Desactivando...' : 'Desactivar'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desactivar programa</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta accion marcara el programa como inactivo. Puedes
                  reactivarlo luego editandolo.
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
        <div className='w-full'>
          <ProgramForm program={program} />
        </div>
      </div>
    </>
  )
}
