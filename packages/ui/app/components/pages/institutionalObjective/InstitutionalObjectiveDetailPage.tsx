import { useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetInstitutionalObjective } from '~/hooks/institutionalObjective/useGetInstitutionalObjective'
import { InstitutionalObjectiveForm } from './InstitutionalObjectiveForm'

export const InstitutionalObjectiveDetailPage = () => {
  const { uid, institutionUid } = useParams()

  if (!uid || !institutionUid) throw new Error('Invalid parameters')

  const { error, loading, institutionalObjective } =
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
      {institutionalObjective && (
        <InstitutionalObjectiveForm
          institutionalObjective={institutionalObjective}
          institutionUid={institutionUid}
        />
      )}
    </>
  )
}
