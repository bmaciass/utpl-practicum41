import type { SelectProps } from '@radix-ui/react-select'
import { capitalize } from 'lodash-es'
import type { CSSProperties } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useInstitutionList } from '~/hooks/institution/useInstitutionList'
import { Alert } from '../globals/Alert'
import { Skeleton } from '../ui/skeleton'

type CustomSelectProps = SelectProps & {
  placeholder?: string
  styles?: {
    trigger?: CSSProperties
  }
}

export const InstitutionSelect = (props: CustomSelectProps) => {
  const { styles, placeholder, ...selectProps } = props

  const { error, loading, institutions } = useInstitutionList()

  if (error) return <Alert variant='error' description={error.message} />

  if (loading) return <Skeleton className='w-full' />

  return (
    <Select {...selectProps}>
      <SelectTrigger style={styles?.trigger}>
        <SelectValue placeholder={placeholder ?? 'Selecciona una institución'} />
      </SelectTrigger>
      <SelectContent>
        {institutions.map(({ uid, name }) => (
          <SelectItem key={`institution-select-${uid}`} value={uid}>
            {capitalize(name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
