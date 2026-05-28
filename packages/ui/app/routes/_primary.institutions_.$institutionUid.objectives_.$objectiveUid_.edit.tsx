import { Link, useParams } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { InstitutionalObjectiveForm } from '~/components/pages/institutionalObjective/InstitutionalObjectiveForm'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { withAuth } from '~/helpers/withAuth'
import { useGetInstitutionalObjective } from '~/hooks/institutionalObjective/useGetInstitutionalObjective'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

function ObjectiveEdit() {
  const { institutionUid, objectiveUid } = useParams()

  if (!institutionUid || !objectiveUid) {
    return <Alert variant='error' description='Parametros no encontrados' />
  }

  const { institutionalObjective, loading, error } =
    useGetInstitutionalObjective(objectiveUid)

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center gap-2'>
        <Link
          to={`/institutions/${institutionUid}/objectives/${objectiveUid}`}
        >
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <Title variant='h4'>Editar objetivo institucional</Title>
      </div>

      {error && (
        <Alert
          variant='error'
          description={error.cause?.message ?? error.message}
        />
      )}
      {loading && <Skeleton className='h-64 w-full' />}
      {institutionalObjective && (
        <InstitutionalObjectiveForm
          institutionalObjective={institutionalObjective}
          institutionUid={institutionUid}
        />
      )}
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <ObjectiveEdit />}</ClientOnly>
}
