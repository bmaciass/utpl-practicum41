import { Outlet, useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { DeletePNDDialog } from '~/components/pages/pnd/DeletePNDDialog'
import { PNDList } from '~/components/pages/pnd/PNDList'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Skeleton } from '~/components/ui/skeleton'
import type { ObjectivePnd } from '~/gql/graphql'
import { withAuth } from '~/helpers/withAuth'
import { usePNDDelete } from '~/hooks/pnd/usePNDDelete'
import { usePNDList } from '~/hooks/pnd/usePNDList'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const PNDPage = () => {
  const navigate = useNavigate()
  const { called, loading, data, error } = usePNDList()
  const { deletePND, loading: deleting } = usePNDDelete()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedObjective, setSelectedObjective] =
    useState<ObjectivePnd | null>(null)

  const handleCreate = () => {
    navigate('/pnd/new')
  }

  const handleSelect = (objective: ObjectivePnd) => {
    navigate(`/pnd/${objective.uid}`)
  }

  const handleDeleteConfirm = async () => {
    if (selectedObjective) {
      await deletePND(selectedObjective.uid)
      setDeleteOpen(false)
      setSelectedObjective(null)
      navigate('/pnd')
    }
  }

  if (!called || loading) {
    return <Skeleton className='h-96 w-full' />
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>
          Error al cargar objetivos: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <div className='grid grid-cols-8 gap-4'>
        <div className='col-span-3 col-start-1 border-r p-4'>
          <PNDList
            objectives={data}
            onSelect={handleSelect}
            onDelete={(objective) => {
              setSelectedObjective(objective)
              setDeleteOpen(true)
            }}
            onCreate={handleCreate}
          />
        </div>
        <div className='col-span-5 col-start-4 p-4'>
          <Outlet />
        </div>
      </div>

      <DeletePNDDialog
        objective={selectedObjective}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleting}
      />
    </>
  )
}

export default function Index() {
  return <ClientOnly>{() => <PNDPage />}</ClientOnly>
}
