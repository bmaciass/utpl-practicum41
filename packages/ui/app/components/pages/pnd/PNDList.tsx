import { Plus } from 'lucide-react'
import type { ObjectivePnd } from '~/gql/graphql'
import { Button } from '~/components/ui/button'
import { PNDCard } from './PNDCard'

interface PNDListProps {
  objectives: ObjectivePnd[]
  onSelect: (objective: ObjectivePnd) => void
  onDelete: (objective: ObjectivePnd) => void
  onCreate: () => void
}

export function PNDList({
  objectives,
  onSelect,
  onDelete,
  onCreate,
}: PNDListProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Objetivos PND</h2>
        <Button variant='secondary' onClick={onCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Nuevo
        </Button>
      </div>
      <div className='flex flex-col gap-2'>
        {objectives.map((objective) => (
          <PNDCard
            key={objective.uid}
            objective={objective}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
