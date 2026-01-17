import type { ObjectivePnd } from '~/gql/graphql'
import { PNDCard } from './PNDCard'

interface PNDListProps {
  objectives: ObjectivePnd[]
  onSelect: (objective: ObjectivePnd) => void
  onDelete: (objective: ObjectivePnd) => void
  onCreate: () => void
}

export function PNDList({ objectives, onSelect, onDelete }: PNDListProps) {
  return (
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
  )
}
