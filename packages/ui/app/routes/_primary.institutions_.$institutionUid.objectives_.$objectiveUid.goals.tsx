import { GoalsPage } from '~/components/pages/goal/GoalsPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <GoalsPage />}</ClientOnly>
}
