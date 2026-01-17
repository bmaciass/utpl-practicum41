"use client"

import { Pie, PieChart } from 'recharts'

import { translateTaskStatus } from '~/lib/statusUtils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import { useTaskStatusReport } from '~/hooks/reports/useTaskStatusReport'

export const description = 'Distribucion de tareas por estado'

const chartConfig = {
  pending: {
    label: 'Pendiente',
    color: 'var(--chart-1)',
  },
  in_progress: {
    label: 'En Progreso',
    color: 'var(--chart-2)',
  },
  reviewing: {
    label: 'En Revision',
    color: 'var(--chart-3)',
  },
  done: {
    label: 'Completado',
    color: 'var(--chart-4)',
  },
  cancelled: {
    label: 'Cancelado',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export function TaskStatusChart() {
  const { records } = useTaskStatusReport()

  const chartData = records.map((record) => ({
    status: record.status,
    count: record.count,
    fill: `var(--color-${record.status})`,
  }))

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Estado de tareas</CardTitle>
        <CardDescription>Distribucion por estado</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] px-0'
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent nameKey='count' hideLabel />
              }
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='status'
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill='hsla(var(--foreground))'
                  >
                    {translateTaskStatus(payload.status)}
                  </text>
                )
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
