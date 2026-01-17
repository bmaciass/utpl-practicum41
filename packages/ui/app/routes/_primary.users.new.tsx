import { UserForm } from '~/components/pages/user/UserForm'
import { withRole } from '~/helpers/withAuth'

export const loader = withRole('admin')

export default function Index() {
  return <UserForm />
}
