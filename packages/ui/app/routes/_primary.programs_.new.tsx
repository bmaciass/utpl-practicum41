import { Link } from '@remix-run/react'
import { ArrowLeft } from 'lucide-react'
import { ProgramForm } from '~/components/pages/program/ProgramForm'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return (
    <ClientOnly>
      {() => (
        <div className='p-4 flex flex-col gap-4'>
          <div className='flex items-center gap-2'>
            <Link to='/programs'>
              <Button variant='ghost' size='icon'>
                <ArrowLeft />
              </Button>
            </Link>
            <Title variant='h4'>Nuevo Programa</Title>
          </div>
          <ProgramForm />
        </div>
      )}
    </ClientOnly>
  )
}
