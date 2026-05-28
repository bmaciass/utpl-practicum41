import { Clock } from 'lucide-react'
import { useProgramsNearEndDateReport } from '~/hooks/reports/useProgramsNearEndDateReport'
import { KpiCard } from './KpiCard'

type Props = {
  fromDate?: string
  toDate?: string
  institutionUid?: string
}

export function ProgramsNearEndDateCard({
  fromDate,
  toDate,
  institutionUid,
}: Props) {
  const { count, loading } = useProgramsNearEndDateReport({
    fromDate,
    toDate,
    institutionUid,
  })

  return (
    <KpiCard
      title='Programas por vencer'
      value={count}
      subtitle='Próximos 30 días con proyectos incompletos'
      icon={Clock}
      accent='warning'
      loading={loading}
    />
  )
}
