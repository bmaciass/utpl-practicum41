import { ProjectNewPage } from '~/components/pages/project/ProjectNewPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <ProjectNewPage />}</ClientOnly>
}
