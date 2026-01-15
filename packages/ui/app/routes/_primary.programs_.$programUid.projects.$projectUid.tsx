import { ProjectDetailPage } from '~/components/pages/project/ProjectDetailPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <ProjectDetailPage />}</ClientOnly>
}
