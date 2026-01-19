import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { useProjectCompletionReport } from '~/hooks/reports/useProjectCompletionReport'

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 1,
  }).format(value)
}

export const ProjectCompletionMetric = ({
  projectUid,
}: {
  projectUid: string
}) => {
  const { report, loading, error } = useProjectCompletionReport(projectUid)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Objetivos completados</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Skeleton className='h-10 w-24' />
          <Skeleton className='h-4 w-40' />
        </CardContent>
      </Card>
    )
  }

  if (error || !report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Objetivos completados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-destructive'>
            No se pudo cargar el porcentaje.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivos completados</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='text-4xl font-semibold'>
          {formatPercent(report.percentage)}%
        </div>
        <p className='text-sm text-muted-foreground'>
          {report.completed} de {report.total} objetivos completados
        </p>
      </CardContent>
    </Card>
  )
}
