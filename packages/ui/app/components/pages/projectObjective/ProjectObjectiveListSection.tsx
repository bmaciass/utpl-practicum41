import { isEmpty } from 'lodash-es'
import { Alert } from '~/components/globals/Alert'
import { Paragraph } from '~/components/typography/Paragraph'
import { Skeleton } from '~/components/ui/skeleton'
import type { ProjectObjective_useProjectObjectiveListQuery } from '~/gql/graphql'
import { useProjectObjectiveList } from '~/hooks/projectObjective/useProjectObjectiveList'
import { ProjectObjectiveList } from './ProjectObjectiveList'

type ProjectObjectiveRecord =
  ProjectObjective_useProjectObjectiveListQuery['projectObjective']['list']['records'][number]

export function ProjectObjectiveListSection(props: {
  programUid: string
  projectUid: string
  onLoaded?: (list: ProjectObjectiveRecord[]) => void
}) {
  const { programUid, projectUid, onLoaded } = props
  const { list, loading, error } = useProjectObjectiveList(projectUid)

  if (loading) return <Skeleton className='h-full w-full' />

  if (error) {
    return (
      <Alert
        variant='error'
        description={`Error cargando objetivos. Error: ${
          error.cause?.message ?? error.message
        }`}
      />
    )
  }

  if (isEmpty(list)) {
    return <Paragraph>No hay objetivos creados</Paragraph>
  }

  if (onLoaded) onLoaded(list)

  return (
    <ProjectObjectiveList
      list={list}
      programUid={programUid}
      projectUid={projectUid}
    />
  )
}
