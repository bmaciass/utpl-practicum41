import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Reports_useOverdueProjectsReport(
    $referenceDate: String
    $institutionUid: String
    $programUid: String
  ) {
    reports {
      overdueProjects(
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

export function useOverdueProjectsReport(options?: Options) {
  const { called, loading, data, error, refetch } = useQuery(QUERY, {
    variables: options,
  })
  const count = data?.reports.overdueProjects.count ?? 0
  return { called, loading, count, error, refetch }
}
