import { AuditDetailPage } from '~/components/pages/audit/AuditDetailPage'
import { withRole } from '~/helpers/withAuth'

export const loader = withRole('admin')

export default function Index() {
  return <AuditDetailPage />
}
