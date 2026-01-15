import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card'
import type { ObjectiveOds_UseOdsListQuery } from '~/gql/graphql'

export const ODSCard = (data: {
  ods: ObjectiveOds_UseOdsListQuery['objectiveODS']['list']['records'][number]
}) => {
  const { uid, name, description } = data.ods

  return (
    <Card key={`ods-${uid}`}>
      <CardHeader>
        <CardTitle className='text-lg'>{name}</CardTitle>
        <CardDescription className='text-sm line-clamp-2'>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
