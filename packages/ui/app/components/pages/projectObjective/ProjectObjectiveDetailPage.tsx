import { useParams } from '@remix-run/react'
import { useMemo, useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetProjectObjective } from '~/hooks/projectObjective/useGetProjectObjective'
import { ProjectObjectiveAlignment } from './ProjectObjectiveAlignment'
import { ProjectObjectiveForm } from './ProjectObjectiveForm'

export function ProjectObjectiveDetailPage() {
  const { programUid, projectUid, uid } = useParams()
  const { objective, loading, error } = useGetProjectObjective(uid)
  const [mode, setMode] = useState<'edit' | 'align'>('edit')

  const isEditMode = mode === 'edit'
  const isAlignMode = mode === 'align'

  const actions = useMemo(
    () => (
      <div className='flex gap-2'>
        <Button
          variant={isEditMode ? 'default' : 'secondary'}
          onClick={() => setMode('edit')}
          disabled={isEditMode}
        >
          Editar
        </Button>
        <Button
          variant={isAlignMode ? 'default' : 'secondary'}
          onClick={() => setMode('align')}
          disabled={isAlignMode}
        >
          Alinear ODS
        </Button>
      </div>
    ),
    [isAlignMode, isEditMode],
  )

  if (!programUid || !projectUid || !uid) {
    return (
      <Alert
        variant='error'
        description='Parametros invalidos para objetivos'
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

  if (!objective) {
    return <Alert variant='error' description='Objetivo no encontrado' />
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <Title variant='h4'>{objective.name}</Title>
        {actions}
      </div>

      {isAlignMode ? (
        <ProjectObjectiveAlignment
          projectObjectiveUid={objective.uid}
          objectiveName={objective.name}
          onCancel={() => setMode('edit')}
        />
      ) : (
        <ProjectObjectiveForm
          objective={objective}
          programUid={programUid}
          projectUid={projectUid}
          disabled={isAlignMode}
        />
      )}
    </div>
  )
}
