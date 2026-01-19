import type { ProjectObjective_useProjectObjectiveListQuery } from '~/gql/graphql'
import { ProjectObjectiveCard } from './ProjectObjectiveCard'

type ProjectObjectiveRecord =
  ProjectObjective_useProjectObjectiveListQuery['projectObjective']['list']['records'][number]

export function ProjectObjectiveList(props: {
  list: ProjectObjectiveRecord[]
  programUid: string
  projectUid: string
}) {
  const { list, programUid, projectUid } = props

  return (
    <div className='flex flex-col gap-2'>
      {list.map((objective) => (
        <ProjectObjectiveCard
          key={objective.uid}
          objective={objective}
          programUid={programUid}
          projectUid={projectUid}
        />
      ))}
    </div>
  )
}
