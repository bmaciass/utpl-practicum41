import { Link, Outlet, useParams } from '@remix-run/react'
import { isEmpty } from 'lodash-es'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useInstitutionalPlanList } from '~/hooks/institutionalPlan/useInstitutionalPlanList'
import { InstitutionalPlanList } from './InstitutionalPlanList'

const InstitutionalPlansSection = (props: { institutionUid: string }) => {
  const { institutionUid } = props
  const { institutionalPlans, error, loading } =
    useInstitutionalPlanList(institutionUid)

  if (loading) {
    return <Skeleton className='h-full w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Planes Institucionales. Error: ${error.cause?.message ?? error.message}`}
      />
    )
  }

  if (isEmpty(institutionalPlans)) {
    return <Paragraph>No hay planes institucionales creados</Paragraph>
  }

  return (
    <div className='py-4'>
      <InstitutionalPlanList
        list={institutionalPlans}
        institutionUid={institutionUid}
      />
    </div>
  )
}

export const InstitutionalPlansPage = () => {
  const params = useParams()
  const institutionUid = params.institutionUid

  if (!institutionUid) {
    return (
      <Alert variant='error' description='ID de institución no encontrado' />
    )
  }

  return (
    <div className='grid grid-cols-6 gap-4'>
      <div className='col-span-3 col-start-1 p-4'>
        <div className='flex'>
          <div className='grow'>
            <Title variant='h4'>Planes Institucionales</Title>
          </div>
          <div className='flex-none'>
            <Link to={`/institutions/${institutionUid}/plans/new`}>
              <Button>Nuevo</Button>
            </Link>
          </div>
        </div>
        <InstitutionalPlansSection institutionUid={institutionUid} />
      </div>
      <div className='col-span-3 col-start-4 p-4'>
        <Outlet />
      </div>
    </div>
  )
}