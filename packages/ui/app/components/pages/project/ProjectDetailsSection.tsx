import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import type { GetProjects_UseGetProjectQuery } from '~/gql/graphql'
import { formatDate } from '~/lib/dateUtils'
import { translateProjectStatus } from '~/lib/statusUtils'
import { ProjectEditForm } from './ProjectEditForm'

export const ProjectDetailsSection = ({
  project,
}: {
  project: GetProjects_UseGetProjectQuery['project']['one']
}) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!project) return null

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle className='text-2xl'>{project.name}</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='outline'>Editar</Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Editar Proyecto</DialogTitle>
              </DialogHeader>
              <ProjectEditForm
                project={project}
                onSuccess={() => setDialogOpen(false)}
                onCancel={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <dt className='font-semibold text-sm text-gray-600'>Descripción</dt>
            <dd className='mt-1'>{project.description || 'Sin descripción'}</dd>
          </div>
          <div>
            <dt className='font-semibold text-sm text-gray-600'>Responsable</dt>
            <dd className='mt-1'>
              {project.responsible?.name || 'Sin asignar'}
            </dd>
          </div>
          <div>
            <dt className='font-semibold text-sm text-gray-600'>
              Fecha de inicio
            </dt>
            <dd className='mt-1'>
              {project.startDate
                ? formatDate(project.startDate)
                : 'No definida'}
            </dd>
          </div>
          <div>
            <dt className='font-semibold text-sm text-gray-600'>
              Fecha de fin
            </dt>
            <dd className='mt-1'>
              {project.endDate ? formatDate(project.endDate) : 'No definida'}
            </dd>
          </div>
          <div>
            <dt className='font-semibold text-sm text-gray-600'>Estado</dt>
            <dd className='mt-1'>{translateProjectStatus(project.status)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
