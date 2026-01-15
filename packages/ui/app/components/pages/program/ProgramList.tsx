import { Separator } from '~/components/ui/separator'
import type { GetProgramList_UseProgramListQuery } from '~/gql/graphql'
import { ProgramCard } from './ProgramCard'

export const ProgramList = (props: {
  list: GetProgramList_UseProgramListQuery['program']['list']['records']
}) => {
  const { list } = props

  const shallowList = [...list]

  const firstRecord = shallowList.shift()
  if (!firstRecord) return null

  const programList = shallowList.map((program) => {
    return (
      <>
        <Separator key={`separator-${program.uid}`} />
        <ProgramCard key={`${program.uid}`} program={program} />
      </>
    )
  })

  programList.unshift(
    <ProgramCard key={firstRecord.uid} program={firstRecord} />,
  )

  return <>{programList}</>
}
