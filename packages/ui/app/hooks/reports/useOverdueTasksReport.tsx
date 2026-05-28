import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Reports_useOverdueTasksReport(
    $referenceDate: String
    $institutionUid: String
    $programUid: String
  ) {
    reports {
      overdueTasks(
        referenceDate: $referenceDate
        institutionUid: $institutionUid
        programUid: $programUid
      ) {
        count
      }
    }
  }
`

type Options = {
  referenceDate?: string
  institutionUid?: string
  programUid?: string
}

export function useOverdueTasksReport(options?: Options) {
  const { called, loading, data, error, refetch } = useQuery(QUERY, {
    variables: options,
  })
  const count = data?.reports.overdueTasks.count ?? 0
  return { called, loading, count, error, refetch }
}
