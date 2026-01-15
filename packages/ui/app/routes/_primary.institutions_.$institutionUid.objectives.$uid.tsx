import { InstitutionalObjectiveDetailPage } from '~/components/pages/institutionalObjective/InstitutionalObjectiveDetailPage'
import { ClientOnly } from '~/utils/ClientOnly'

export default function Index() {
  return <ClientOnly>{() => <InstitutionalObjectiveDetailPage />}</ClientOnly>
}
