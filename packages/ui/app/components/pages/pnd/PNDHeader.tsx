import { Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface PNDHeaderProps {
  onCreate: () => void
}

export const PNDHeader = ({ onCreate }: PNDHeaderProps) => {
  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-2xl font-bold'>
        Objetivos del Plan Nacional de Desarrollo
      </h2>
      <Button onClick={onCreate}>
        <Plus className='mr-2 h-4 w-4' />
        Nuevo Objetivo
      </Button>
    </div>
  )
}
