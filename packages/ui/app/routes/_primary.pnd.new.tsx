import { useNavigate } from '@remix-run/react'
import { PNDForm } from '~/components/pages/pnd/PNDForm'

export default function PNDNewRoute() {
  const navigate = useNavigate()

  return (
    <PNDForm
      onCancel={() => navigate('/pnd')}
      onSuccess={(created) => navigate(`/pnd/${created.uid}`)}
    />
  )
}
