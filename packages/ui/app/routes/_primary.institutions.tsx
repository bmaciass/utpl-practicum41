import { InstitutionsPage } from '~/components/pages/institution/InstitutionPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index () {
  return (
    <ClientOnly>{() => <InstitutionsPage />}</ClientOnly>
  )
}
