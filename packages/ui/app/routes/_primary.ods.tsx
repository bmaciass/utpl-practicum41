import { isEmpty } from 'lodash-es'
import { Alert } from '~/components/globals/Alert'
import { ODSList } from '~/components/pages/ods/ODSList'
import { Title } from '~/components/typography/Headers'
import { Paragraph } from '~/components/typography/Paragraph'
import { Skeleton } from '~/components/ui/skeleton'
import { withAuth } from '~/helpers/withAuth'
import { useODSList } from '~/hooks/ods/useODSList'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const getODSNumber = (name: string) => {
  const s = name.split(':').at(0)?.split(' ').at(1)
  return s ? Number.parseInt(s) : 0
}

const ODSPage = () => {
  const { odsList, error, loading } = useODSList()

  if (loading) {
    return <Skeleton className='h-full w-full' />
  }

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando Objetivos ODS. Error: ${error.message}`}
      />
    )
  }

  if (isEmpty(odsList)) {
    return <Paragraph>No hay objetivos ODS disponibles</Paragraph>
  }

  const list = [...odsList]

  list.sort((a, b) => {
    const nA = getODSNumber(a.name)
    const nB = getODSNumber(b.name)

    return nA - nB
  })

  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <div className='mb-6'>
        <Title variant='h4'>Objetivos de Desarrollo Sostenible (ODS)</Title>
        <Paragraph className='mt-2 text-gray-600'>
          Agenda 2030 de las Naciones Unidas - {odsList.length} Objetivos
          Globales
        </Paragraph>
      </div>
      <div className='py-4'>
        <ODSList list={list} />
      </div>
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <ODSPage />}</ClientOnly>
}
