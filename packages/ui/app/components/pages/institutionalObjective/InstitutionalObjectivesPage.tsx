import { Link, useParams } from '@remix-run/react'
import { isEmpty } from 'lodash-es'
import { ArrowLeft } from 'lucide-react'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useRegisterBreadcrumbName } from '~/context/BreadcrumbNames'
import { useGetInstitution } from '~/hooks/institution/useGetInstitution'
import { useInstitutionalObjectiveList } from '~/hooks/institutionalObjective/useInstitutionalObjectiveList'
import { InstitutionalObjectiveList } from './InstitutionalObjectiveList'

const InstitutionalObjectivesSection = (props: { institutionUid: string }) => {
  const { institutionUid } = props
  const { list, error, loading } = useInstitutionalObjectiveList({
    institutionUid,
    active: true,
  })

  if (loading) {
    return <Skeleton className='h-full w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Objetivos Institucionales. Error: ${error.cause?.message ?? error.message}`}
      />
    )
  }

  if (isEmpty(list)) {
    return <Paragraph>No hay objetivos institucionales creados</Paragraph>
  }

  return (
    <div className='py-4'>
      <InstitutionalObjectiveList list={list} institutionUid={institutionUid} />
    </div>
  )
}

export const InstitutionalObjectivesPage = () => {
  const params = useParams()
  const institutionUid = params.institutionUid

  if (!institutionUid) {
    return (
      <Alert variant='error' description='ID de institución no encontrado' />
    )
  }

  const { institution } = useGetInstitution(institutionUid)
  useRegisterBreadcrumbName(institutionUid, institution?.name)

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center gap-2'>
        <Link to={`/institutions/${institutionUid}`}>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Link>
        <div className='grow'>
          <Title variant='h4'>Objetivos Institucionales</Title>
        </div>
        <Link to={`/institutions/${institutionUid}/objectives/new`}>
          <Button>Nuevo</Button>
        </Link>
      </div>
      <InstitutionalObjectivesSection institutionUid={institutionUid} />
    </div>
  )
}
