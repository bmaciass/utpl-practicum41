import { useNavigate } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { ProjectObjective_useProjectObjectiveListQuery } from '~/gql/graphql'
import { translateTaskStatus } from '~/lib/statusUtils'

export function ProjectObjectiveCard(props: {
  objective: ProjectObjective_useProjectObjectiveListQuery['projectObjective']['list']['records'][number]
  programUid: string
  projectUid: string
}) {
  const { objective, programUid, projectUid } = props
  const navigate = useNavigate()

  return (
    <Card
      className='cursor-pointer transition hover:border-primary'
      onClick={() =>
        navigate(
          `/programs/${programUid}/projects/${projectUid}/objectives/${objective.uid}`,
        )
      }
    >
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-base font-semibold'>
            {objective.name}
          </CardTitle>
          <div className='flex flex-wrap gap-2 justify-end'>
            <Badge variant='outline'>
              {translateTaskStatus(objective.status)}
            </Badge>
            <Badge variant={objective.active ? 'default' : 'secondary'}>
              {objective.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-xs text-muted-foreground'>
          Gestiona su alineacion con ODS desde el detalle.
        </p>
      </CardContent>
    </Card>
  )
}
