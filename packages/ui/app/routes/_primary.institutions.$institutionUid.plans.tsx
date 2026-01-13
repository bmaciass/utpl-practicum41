import { InstitutionalPlansPage } from '~/components/pages/institutionalPlan/InstitutionalPlansPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <InstitutionalPlansPage />}</ClientOnly>
}
