import { Plus } from 'lucide-react'
import { Title } from '~/components/typography/Headers'
import { Button } from '~/components/ui/button'

interface PNDHeaderProps {
  onCreate: () => void
}

export const PNDHeader = ({ onCreate }: PNDHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <Title variant='h2'>Instituciones</Title>
      <Button onClick={onCreate}>
        <Plus className='mr-2 h-4 w-4' />
        Nueva Institucion
      </Button>
    </div>
  )
}
