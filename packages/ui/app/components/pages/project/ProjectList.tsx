import { Separator } from '~/components/ui/separator'
import type { GetProjectList_UseProjectListQuery } from '~/gql/graphql'
import { ProjectCard } from './ProjectCard'

export const ProjectList = (props: {
  list: GetProjectList_UseProjectListQuery['project']['list']['records']
}) => {
  const { list } = props
  const shallowClonedList = [...list]

  const firstRecord = shallowClonedList.shift()
  if (!firstRecord) return null

  const projectList = shallowClonedList.map((record) => {
    return (
      <>
        <Separator key={`separator-${record.uid}`} />
        <ProjectCard key={`${record.uid}`} project={record} />
      </>
    )
  })

  projectList.unshift(
    <ProjectCard key={firstRecord.uid} project={firstRecord} />,
  )

  return <>{projectList}</>
}
