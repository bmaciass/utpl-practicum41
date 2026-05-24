import { Link } from '@remix-run/react'
import { isEmpty } from 'lodash-es'
import { Alert } from '~/components/globals/Alert'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useInstitutionList } from '~/hooks/institution/useInstitutionList'
import { InstitutionList } from './InstitutionList'

const InstitutionsSection = () => {
  const { institutions, error, loading } = useInstitutionList()
  if (loading) {
    return <Skeleton className='h-full w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Instituciones. Error: ${error.cause?.message ?? error.message}`}
      />
    )
  }

  if (isEmpty(institutions)) {
    return <Paragraph>No hay instituciones creadas</Paragraph>
  }

  return (
    <div className='py-4'>
      <InstitutionList list={institutions} />
    </div>
  )
}

export const InstitutionsPage = () => {
  return (
    <div className='p-4'>
      <div className='flex items-center justify-between mb-6'>
        <Title variant='h4'>Instituciones</Title>
        <Link to='/institutions/new'>
          <Button>Nuevo</Button>
        </Link>
      </div>
      <InstitutionsSection />
    </div>
  )
}
