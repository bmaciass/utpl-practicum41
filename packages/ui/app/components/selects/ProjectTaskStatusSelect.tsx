import type { SelectProps } from '@radix-ui/react-select'
import type { CSSProperties } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type CustomSelectProps = SelectProps & {
  placeholder?: string
  styles?: {
    trigger?: CSSProperties
  }
}

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'reviewing', label: 'En Revisión' },
  { value: 'done', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

export const ProjectTaskStatusSelect = (props: CustomSelectProps) => {
  const { styles, placeholder, ...selectProps } = props

  return (
    <Select {...selectProps}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={placeholder ?? 'Selecciona un estado'} />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={`task-status-${option.value}`} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
