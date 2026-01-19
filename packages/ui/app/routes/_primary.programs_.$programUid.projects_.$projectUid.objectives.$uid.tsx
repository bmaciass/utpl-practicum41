import { ClientOnly } from '~/utils/ClientOnly'
import { ProjectObjectiveDetailPage } from '~/components/pages/projectObjective/ProjectObjectiveDetailPage'
import { withAuth } from '~/helpers/withAuth'

export const loader = withAuth()

export default function ProjectObjectiveDetailRoute() {
  return <ClientOnly>{() => <ProjectObjectiveDetailPage />}</ClientOnly>
}
