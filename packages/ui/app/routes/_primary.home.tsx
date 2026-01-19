import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'
import { ReportsPage } from '~/components/pages/reports/ReportsPage'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <ReportsPage />}</ClientOnly>
}
