import { AuditPage } from '~/components/pages/audit/AuditPage'
import { withRole } from '~/helpers/withAuth'

export const loader = withRole('admin')

export default function Index() {
  return <AuditPage />
}
