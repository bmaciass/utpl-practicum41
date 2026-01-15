import { useNavigate } from '@remix-run/react'
import { capitalize } from 'lodash-es'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import type { GetProjectList_UseProjectListQuery } from '~/gql/graphql'

export const ProjectCard = (data: {
  project: GetProjectList_UseProjectListQuery['project']['list']['records'][number]
}) => {
  const { uid, name, program } = data.project
  const navigate = useNavigate()

  const handleOnClick = (id: string) => {
    navigate(`/programs/${program.uid}/projects/${uid}`)
  }

  return (
    <Card
      className='cursor-pointer'
      key={`project-${uid}`}
      onClick={() => {
        handleOnClick(uid)
      }}
    >
      <CardHeader>
        <CardTitle>{capitalize(name)}</CardTitle>
      </CardHeader>
    </Card>
  )
}
