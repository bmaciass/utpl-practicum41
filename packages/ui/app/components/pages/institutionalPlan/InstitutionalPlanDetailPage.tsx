import { useNavigate, useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetInstitutionalPlan } from '~/hooks/institutionalPlan/useGetInstitutionalPlan'
import { useUpdateInstitutionalPlan } from '~/hooks/institutionalPlan/useUpdateInstitutionalPlan'
import { InstitutionalPlanForm } from './InstitutionalPlanForm'

export const InstitutionalPlanDetailPage = () => {
  const { uid, institutionUid } = useParams()
  const navigate = useNavigate()

  const {
    updateInstitutionalPlan,
    loading: loadingDelete,
    error: errorDelete,
  } = useUpdateInstitutionalPlan()

  const { error, loading, institutionalPlan } = useGetInstitutionalPlan(uid!)

  const handleDelete = () => {
    const confirmed = window.confirm(
      '¿Está seguro que desea eliminar este plan institucional?',
    )
    if (confirmed && institutionalPlan) {
      updateInstitutionalPlan({
        variables: {
          data: {
            active: false,
            name: institutionalPlan.name,
            year: institutionalPlan.year,
          },
          where: { id: uid! },
        },
        onCompleted: () => {
          navigate(`/institutions/${institutionUid}/plans?deleted=success`)
        },
      })
    }
  }

  return (
    <>
      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}
      {errorDelete && (
        <Alert
          closable
          variant='error'
          description={errorDelete.cause?.message ?? errorDelete.message}
        />
      )}
      {loading && <Skeleton className='w-full' />}
      {institutionalPlan && (
        <div className='flex flex-col gap-y-2'>
          <div className='flex justify-end'>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              Eliminar
            </Button>
          </div>
          <InstitutionalPlanForm
            institutionalPlan={institutionalPlan}
            institutionUid={institutionUid!}
          />
        </div>
      )}
    </>
  )
}
