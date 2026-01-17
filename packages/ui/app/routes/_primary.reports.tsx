import { ProjectStatusChart } from '~/components/pages/reports/ProjectStatusChart'
import { TaskStatusChart } from '~/components/pages/reports/TaskStatusChart'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'
import { Button } from '~/components/ui/button'
import { useRef, useState } from 'react'

export const loader = withAuth()

const ReportsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

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

      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, Math.min(imgHeight, pageHeight - 40))
      pdf.save('reporte-proyectos-tareas.pdf')
    } catch (error) {
      console.error('Error generating PDF', error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-end'>
        <Button variant='secondary' onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </div>
      <div
        ref={containerRef}
        className='grid grid-cols-1 gap-6 md:grid-cols-2 bg-white p-2 rounded-md'
      >
        <ProjectStatusChart />
        <TaskStatusChart />
      </div>
    </div>
  )
}

export default function Index() {
  return <ClientOnly>{() => <ReportsPage />}</ClientOnly>
}
