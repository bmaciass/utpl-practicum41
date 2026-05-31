import {
  type LoaderFunction,
  type MetaFunction,
  redirect,
} from '@remix-run/cloudflare'
import { withAuth } from '~/helpers/withAuth'

export const meta: MetaFunction = () => {
  return [
    { title: 'SIGEP' },
    { name: 'description', content: 'Sistema de Gestion de la Planificacion' },
  ]
}

export const loader: LoaderFunction = withAuth(async () => {
  return redirect('/home')
})

export default function Index () {
  return null
}
