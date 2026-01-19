import { ProjectObjectivesPage } from '~/components/pages/projectObjective/ProjectObjectivesPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <ProjectObjectivesPage />}</ClientOnly>
}
