import {
  type LoaderFunction,
  type MetaFunction,
  redirect,
} from '@remix-run/cloudflare'
import { withAuth } from '~/helpers/withAuth'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader: LoaderFunction = withAuth(async () => {
  return redirect('/home')
})

export default function Index() {
  return null
}
