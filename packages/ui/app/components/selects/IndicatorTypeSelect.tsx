import type { SelectProps } from '@radix-ui/react-select'
import type { CSSProperties } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { IndicatorType } from '~/gql/graphql'

type CustomSelectProps = SelectProps & {
  placeholder?: string
  styles?: {
    trigger?: CSSProperties
  }
}

export const IndicatorTypeSelect = (props: CustomSelectProps) => {
  const { styles, placeholder, ...selectProps } = props

  const records: Record<IndicatorType, string> = {
    [IndicatorType.Number]: 'Número',
    [IndicatorType.Percentage]: 'Porcentaje',
  }

  return (
    <Select {...selectProps}>
      <SelectTrigger className='w-[200px]' style={styles?.trigger}>
        <SelectValue placeholder={placeholder ?? 'Selecciona un tipo'} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(records).map(([value, label]) => (
          <SelectItem key={`indicator-type-${value}`} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
