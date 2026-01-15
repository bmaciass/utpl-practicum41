import { useParams } from '@remix-run/react'
import { useState } from 'react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetInstitutionalObjective } from '~/hooks/institutionalObjective/useGetInstitutionalObjective'
import { InstitutionalObjectiveAlignment } from './InstitutionalObjectiveAlignment'
import { InstitutionalObjectiveForm } from './InstitutionalObjectiveForm'

export const InstitutionalObjectiveDetailPage = () => {
  const { uid, institutionUid } = useParams()

  if (!uid || !institutionUid) throw new Error('Invalid parameters')

  const [alignmentMode, setAlignmentMode] = useState(false)

  const { error, loading, institutionalObjective, refetch } =
    useGetInstitutionalObjective(uid)

  return (
    <>
      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}
      {loading && <Skeleton className='w-full' />}
      {institutionalObjective &&
        (alignmentMode ? (
          <InstitutionalObjectiveAlignment
            institutionalObjectiveUid={institutionalObjective.uid}
            objectiveName={institutionalObjective.name}
            objectiveDescription={institutionalObjective.description}
            onCancel={() => setAlignmentMode(false)}
            onSaved={() => {
              setAlignmentMode(false)
              refetch()
            }}
          />
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <Title variant='h4'>{institutionalObjective.name}</Title>
              <Button
                variant='outline'
                type='button'
                onClick={() => setAlignmentMode(true)}
              >
                Alinear
              </Button>
            </div>
            <InstitutionalObjectiveForm
              institutionalObjective={institutionalObjective}
              institutionUid={institutionUid}
            />
          </div>
        ))}
    </>
  )
}
