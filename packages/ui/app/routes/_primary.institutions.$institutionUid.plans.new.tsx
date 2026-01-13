import { InstitutionalPlanNewPage } from '~/components/pages/institutionalPlan/InstitutionalPlanNewPage'
import { ClientOnly } from '~/utils/ClientOnly'

export default function Index() {
  return <ClientOnly>{() => <InstitutionalPlanNewPage />}</ClientOnly>
}
