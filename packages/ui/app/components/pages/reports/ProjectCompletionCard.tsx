import { capitalize } from 'lodash-es'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useProgramList } from '~/hooks/program/useProgramList'
import { useProjectList } from '~/hooks/project/useProjectList'
import { useProjectCompletionReport } from '~/hooks/reports/useProjectCompletionReport'

const formatPercent = (value: number) =>
  new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(value)

function CompletionResult({ projectUid }: { projectUid: string }) {
  const { report, loading, error } = useProjectCompletionReport(projectUid)

  if (loading) {
    return <p className='text-sm text-muted-foreground'>Cargando…</p>
  }

  if (error || !report) {
    return (
      <p className='text-sm text-destructive'>
        No se pudo cargar el porcentaje.
      </p>
    )
  }

  return (
    <div className='flex flex-col gap-1'>
      <span className='text-4xl font-bold text-primary'>
        {formatPercent(report.percentage)}%
      </span>
      <span className='text-sm text-muted-foreground'>
        {report.completed} de {report.total} objetivos completados
      </span>
    </div>
  )
}

export function ProjectCompletionCard() {
  const [programUid, setProgramUid] = useState<string>()
  const [projectUid, setProjectUid] = useState<string>()

  const { programs, loading: loadingPrograms } = useProgramList()
  const { projects, loading: loadingProjects } = useProjectList(
    programUid ?? '',
  )

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <CardTitle>Avance de proyecto</CardTitle>
        <CardDescription>
          Porcentaje de objetivos completados de un proyecto
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-wrap gap-4'>
          <div className='flex min-w-[200px] flex-1 flex-col gap-1.5'>
            <span className='text-sm font-medium text-muted-foreground'>
              Programa
            </span>
            <Select
              value={programUid ?? ''}
              disabled={loadingPrograms}
              onValueChange={(value) => {
                setProgramUid(value)
                setProjectUid(undefined)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un programa' />
              </SelectTrigger>
              <SelectContent>
                {programs.map(({ uid, name }) => (
                  <SelectItem key={`completion-program-${uid}`} value={uid}>
                    {capitalize(name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex min-w-[200px] flex-1 flex-col gap-1.5'>
            <span className='text-sm font-medium text-muted-foreground'>
              Proyecto
            </span>
            <Select
              value={projectUid ?? ''}
              disabled={!programUid || loadingProjects}
              onValueChange={setProjectUid}
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecciona un proyecto' />
              </SelectTrigger>
              <SelectContent>
                {projects.map(({ uid, name }) => (
                  <SelectItem key={`completion-project-${uid}`} value={uid}>
                    {capitalize(name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {projectUid ? (
          <CompletionResult projectUid={projectUid} />
        ) : (
          <p className='text-sm text-muted-foreground'>
            Selecciona un programa y un proyecto para ver su avance.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
