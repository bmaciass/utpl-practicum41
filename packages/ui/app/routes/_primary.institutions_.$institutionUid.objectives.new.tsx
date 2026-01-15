import { InstitutionalObjectiveNewPage } from '~/components/pages/institutionalObjective/InstitutionalObjectiveNewPage'
import { ClientOnly } from '~/utils/ClientOnly'

export default function Index() {
  return <ClientOnly>{() => <InstitutionalObjectiveNewPage />}</ClientOnly>
}
