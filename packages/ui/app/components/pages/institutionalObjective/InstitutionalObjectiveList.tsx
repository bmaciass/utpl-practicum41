import { Fragment } from 'react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Separator } from '~/components/ui/separator'
import type { InstitutionalObjectiveList_UseInstitutionalObjectiveListQuery } from '~/gql/graphql'
import { InstitutionalObjectiveCard } from './InstitutionalObjectiveCard'

export const InstitutionalObjectiveList = (props: {
  list: InstitutionalObjectiveList_UseInstitutionalObjectiveListQuery['institutionalObjective']['list']['records']
  institutionUid: string
}) => {
  const { list, institutionUid } = props

  if (list.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No se encontraron objetivos institucionales
        </AlertDescription>
      </Alert>
    )
  }

  const shallowClonedList = [...list]

  const firstRecord = shallowClonedList.shift()
  if (!firstRecord) return null

  const objectiveList = shallowClonedList.map((record) => {
    return (
      <Fragment key={record.uid}>
        <Separator />
        <InstitutionalObjectiveCard
          objective={record}
          institutionUid={institutionUid}
        />
      </Fragment>
    )
  })

  objectiveList.unshift(
    <InstitutionalObjectiveCard
      key={firstRecord.uid}
      objective={firstRecord}
      institutionUid={institutionUid}
    />,
  )

  return <>{objectiveList}</>
}
