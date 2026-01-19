import { useParams } from '@remix-run/react'
import { Alert } from '~/components/globals/Alert'
import { ProjectObjectiveForm } from '~/components/pages/projectObjective/ProjectObjectiveForm'
import { withAuth } from '~/helpers/withAuth'
import { ClientOnly } from '~/utils/ClientOnly'

export const loader = withAuth()

const ProjectObjectiveNewInner = () => {
  const { programUid, projectUid } = useParams()

  if (!programUid || !projectUid) {
    return (
      <Alert
        variant='error'
        description='Parametros invalidos para objetivos'
      />
    )
  }

  return (
    <ProjectObjectiveForm programUid={programUid} projectUid={projectUid} />
  )
}

export default function ProjectObjectiveNewRoute() {
  return <ClientOnly>{() => <ProjectObjectiveNewInner />}</ClientOnly>
}
