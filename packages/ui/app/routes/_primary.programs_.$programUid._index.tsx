import { Link, useParams } from '@remix-run/react'
import { capitalize } from 'lodash-es'
import { useState } from 'react'
import { DetailHero } from '~/components/DetailHero'
import { Alert } from '~/components/globals/Alert'
import { ProjectList } from '~/components/pages/project/ProjectList'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
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
import { Skeleton } from '~/components/ui/skeleton'
import { useRegisterBreadcrumbName } from '~/context/BreadcrumbNames'
import { withAuth } from '~/helpers/withAuth'
import { useGetProgram } from '~/hooks/program/useGetProgram'
import { useUpdateProgram } from '~/hooks/program/useUpdateProgram'
import { useProjectList } from '~/hooks/project/useProjectList'
import { formatDateRange } from '~/lib/dateUtils'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const ProjectsSection = ({ programUid }: { programUid: string }) => {
  const { projects, error, loading } = useProjectList(programUid)

  if (loading) return <Skeleton className='h-32 w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Proyectos. Error: ${error.message}`}
      />
    )
  }

  if (projects.length === 0) {
    return <Paragraph>No hay proyectos creados</Paragraph>
  }

  return <ProjectList list={projects} />
}

function ProgramDetailPage() {
  const { programUid } = useParams()
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  if (!programUid) {
    return <Alert variant='error' description='Parametro no encontrado' />
  }

  const { error, loading, program } = useGetProgram(programUid)
  useRegisterBreadcrumbName(programUid, program?.name)

  const { updateProgram, loading: updatingProgram } = useUpdateProgram()

  const handleDeactivate = async () => {
    await updateProgram({
      variables: {
        where: { id: programUid },
        data: { active: false },
      },
    })
    setDeactivateOpen(false)
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
        backTo='/programs'
        title={capitalize(program?.name ?? '')}
        active={program?.active}
        loading={loading}
        fields={
          program
            ? [
                {
                  label: 'Institución',
                  value: capitalize(program.institution.name),
                },
                {
                  label: 'Responsable',
                  value: `${program.responsible.person.firstName} ${program.responsible.person.lastName}`,
                },
                {
                  label: 'Periodo',
                  value:
                    formatDateRange(program.startDate, program.endDate) || '—',
                },
                {
                  label: 'Inversión estimada',
                  value:
                    program.estimatedInversion != null
                      ? `$${program.estimatedInversion}`
                      : '—',
                },
              ]
            : []
        }
        description={program?.description}
        menuActions={[
          {
            label: 'Desactivar',
            onClick: () => setDeactivateOpen(true),
            destructive: true,
          },
        ]}
        menuDisabled={updatingProgram}
      />

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Title variant='h4'>Proyectos</Title>
          <Link to={`/programs/${programUid}/projects/new`}>
            <Button size='sm'>Nuevo Proyecto</Button>
          </Link>
        </div>
        <ProjectsSection programUid={programUid} />
      </div>

      <AlertDialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desactivar programa</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion marcara el programa como inactivo. Puedes reactivarlo
              luego editandola.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={updatingProgram}
            >
              {updatingProgram ? 'Desactivando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <ProgramDetailPage />}</ClientOnly>
}
