import { InstitutionalObjectivesPage } from '~/components/pages/institutionalObjective/InstitutionalObjectivesPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <InstitutionalObjectivesPage />}</ClientOnly>
}
