import { CalendarX2 } from 'lucide-react'
import { useOverdueProjectsReport } from '~/hooks/reports/useOverdueProjectsReport'
import { KpiCard } from './KpiCard'

type Props = {
  referenceDate?: string
  institutionUid?: string
}

export function OverdueProjectsCard({ referenceDate, institutionUid }: Props) {
  const { count, loading } = useOverdueProjectsReport({
    referenceDate,
    institutionUid,
  })

  return (
    <KpiCard
      title='Proyectos vencidos'
      value={count}
      subtitle='Sin completar pasada su fecha de fin'
      icon={CalendarX2}
      accent='destructive'
      loading={loading}
    />
  )
}
