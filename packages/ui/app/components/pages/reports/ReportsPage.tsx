import { useMemo, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { OverdueProjectsCard } from './OverdueProjectsCard'
import { OverdueTasksCard } from './OverdueTasksCard'
import { ProgramsNearEndDateCard } from './ProgramsNearEndDateCard'
import { ProjectCompletionCard } from './ProjectCompletionCard'
import { ProjectStatusChart } from './ProjectStatusChart'
import { type ReportsFilters, ReportsFilterBar } from './ReportsFilterBar'
import { TaskStatusChart } from './TaskStatusChart'

const NEAR_END_WINDOW_DAYS = 30

export const ReportsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [filters, setFilters] = useState<ReportsFilters>({})

  const { institutionUid, referenceDate } = filters

  const nearEndWindow = useMemo(() => {
    if (!referenceDate) return { fromDate: undefined, toDate: undefined }
    const from = new Date(referenceDate)
    const to = new Date(from)
    to.setDate(to.getDate() + NEAR_END_WINDOW_DAYS)
    return { fromDate: from.toISOString(), toDate: to.toISOString() }
  }, [referenceDate])

  const handleDownload = async () => {
    if (!containerRef.current || downloading) return
    setDownloading(true)
    try {
      const [html2canvas, { default: jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ])

      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth - 40
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(
        imgData,
        'PNG',
        20,
        20,
        imgWidth,
        Math.min(imgHeight, pageHeight - 40),
      )
      pdf.save('reporte-proyectos-tareas.pdf')
    } catch (error) {
      console.error('Error generating PDF', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>Reportes</h1>
          <p className='text-sm text-muted-foreground'>
            Indicadores de seguimiento de programas, proyectos y tareas
          </p>
        </div>
        <Button
          variant='secondary'
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </div>

      <ReportsFilterBar filters={filters} onChange={setFilters} />

      <div ref={containerRef} className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <OverdueProjectsCard
            referenceDate={referenceDate}
            institutionUid={institutionUid}
          />
          <OverdueTasksCard
            referenceDate={referenceDate}
            institutionUid={institutionUid}
          />
          <ProgramsNearEndDateCard
            fromDate={nearEndWindow.fromDate}
            toDate={nearEndWindow.toDate}
            institutionUid={institutionUid}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <ProjectStatusChart institutionUid={institutionUid} />
          <TaskStatusChart institutionUid={institutionUid} />
        </div>

        <ProjectCompletionCard />
      </div>
    </div>
  )
}
