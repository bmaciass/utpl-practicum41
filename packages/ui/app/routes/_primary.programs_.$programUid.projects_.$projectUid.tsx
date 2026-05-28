import { Outlet } from '@remix-run/react'
import { withAuth } from '~/helpers/withAuth'

export const loader = withAuth()

export default function ProjectLayout() {
  return <Outlet />
}
