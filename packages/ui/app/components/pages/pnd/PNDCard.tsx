import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import type { ObjectivePnd } from '~/gql/graphql'

interface PNDCardProps {
  objective: ObjectivePnd
  onSelect: (objective: ObjectivePnd) => void
  onDelete: (objective: ObjectivePnd) => void
}

export function PNDCard({ objective, onSelect, onDelete }: PNDCardProps) {
  return (
    <Card
      className='w-full cursor-pointer transition hover:border-primary'
      onClick={() => onSelect(objective)}
    >
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-xl'>{objective.name}</CardTitle>
            {!objective.active && (
              <span className='text-sm text-muted-foreground'>(Inactivo)</span>
            )}
          </div>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={(event) => {
                event.stopPropagation()
                onSelect(objective)
              }}
              title='Ver / editar objetivo'
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={(event) => {
                event.stopPropagation()
                onDelete(objective)
              }}
              title='Eliminar objetivo'
              disabled={!objective.active}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm'>
          {objective.description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
