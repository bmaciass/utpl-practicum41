import { useNavigate } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  IndicatorType,
  type Indicator_UseGetIndicatorQuery,
  type Indicator_UseIndicatorListQuery,
} from '~/gql/graphql'

type IndicatorRecord =
  | Indicator_UseIndicatorListQuery['indicator']['list']['records'][number]
  | NonNullable<Indicator_UseGetIndicatorQuery['indicator']['one']>

const indicatorTypeLabels: Record<IndicatorType, string> = {
  [IndicatorType.Number]: 'Número',
  [IndicatorType.Percentage]: 'Porcentaje',
}

export function IndicatorCard(props: {
  indicator: IndicatorRecord
  goalUid: string
  institutionUid: string
  objectiveUid: string
}) {
  const { indicator, goalUid, institutionUid, objectiveUid } = props
  const navigate = useNavigate()
  const typeLabel = indicator.type ? indicatorTypeLabels[indicator.type] : null

  const metaParts = [
    indicator.unitType ? `Unidad: ${indicator.unitType}` : null,
    indicator.minValue !== null && indicator.minValue !== undefined
      ? `Min: ${indicator.minValue}`
      : null,
    indicator.maxValue !== null && indicator.maxValue !== undefined
      ? `Max: ${indicator.maxValue}`
      : null,
  ].filter(Boolean)

  return (
    <Card
      className='cursor-pointer transition hover:border-primary'
      onClick={() =>
        navigate(
          `/institutions/${institutionUid}/objectives/${objectiveUid}/goals/${goalUid}/indicators/${indicator.uid}`,
        )
      }
    >
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-base font-semibold'>
            {indicator.name}
          </CardTitle>
          <div className='flex flex-wrap gap-2'>
            {typeLabel && <Badge variant='outline'>{typeLabel}</Badge>}
            <Badge variant={indicator.active ? 'default' : 'secondary'}>
              {indicator.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {indicator.description && (
          <p className='text-sm text-muted-foreground line-clamp-2'>
            {indicator.description}
          </p>
        )}
        {metaParts.length > 0 && (
          <p className='mt-2 text-xs text-muted-foreground'>
            {metaParts.join(' • ')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
