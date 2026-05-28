import { ClipboardX } from 'lucide-react'
import { useOverdueTasksReport } from '~/hooks/reports/useOverdueTasksReport'
import { KpiCard } from './KpiCard'

type Props = {
  referenceDate?: string
  institutionUid?: string
}

export function OverdueTasksCard({ referenceDate, institutionUid }: Props) {
  const { count, loading } = useOverdueTasksReport({
    referenceDate,
    institutionUid,
  })

  return (
    <KpiCard
      title='Tareas vencidas'
      value={count}
      subtitle='Sin completar pasada su fecha de fin'
      icon={ClipboardX}
      accent='destructive'
      loading={loading}
    />
  )
}
