import { useNavigate, useParams } from '@remix-run/react'
import { useState } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Skeleton } from '~/components/ui/skeleton'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { PNDForm } from '~/components/pages/pnd/PNDForm'
import { PNDAlignment } from '~/components/pages/pnd/PNDAlignment'
import { usePNDOne } from '~/hooks/pnd/usePNDOne'

export default function PNDDetailRoute() {
  const { uid } = useParams()
  const navigate = useNavigate()
  const { objective, loading, error, refetch } = usePNDOne(uid)
  const [alignmentMode, setAlignmentMode] = useState(false)

  if (!uid) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>Objetivo PND no encontrado</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return <Skeleton className='h-96 w-full' />
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          Error al cargar objetivo: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (!objective) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>Objetivo PND no encontrado</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      {alignmentMode ? (
        <PNDAlignment
          pndObjectiveUid={objective.uid}
          objectiveName={objective.name}
          objectiveDescription={objective.description}
          onCancel={() => setAlignmentMode(false)}
          onSaved={async () => {
            await refetch()
            setAlignmentMode(false)
          }}
        />
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <Title variant='h4'>{objective.name}</Title>
            <Button variant='outline' onClick={() => setAlignmentMode(true)}>
              Alinear
            </Button>
          </div>
          <PNDForm
            objective={objective}
            onCancel={() => navigate('/pnd')}
            onSuccess={async (updated) => {
              await refetch()
              navigate(`/pnd/${updated.uid}`)
            }}
          />
        </div>
      )}
    </div>
  )
}
