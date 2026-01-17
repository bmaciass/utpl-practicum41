import { IndicatorsPage } from '~/components/pages/indicator/IndicatorsPage'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

export default function Index() {
  return <ClientOnly>{() => <IndicatorsPage />}</ClientOnly>
}
