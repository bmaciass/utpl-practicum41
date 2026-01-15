import { InstitutionalPlanDetailPage } from '~/components/pages/institutionalPlan/InstitutionalPlanDetailPage'
import { ClientOnly } from '~/utils/ClientOnly'

export default function Index() {
  return <ClientOnly>{() => <InstitutionalPlanDetailPage />}</ClientOnly>
}
