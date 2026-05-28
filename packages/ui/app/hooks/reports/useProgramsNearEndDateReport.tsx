import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Reports_useProgramsNearEndDateReport(
    $fromDate: String
    $toDate: String
    $institutionUid: String
  ) {
    reports {
      programsNearEndDate(
        fromDate: $fromDate
        toDate: $toDate
        institutionUid: $institutionUid
      ) {
        count
      }
    }
  }
`

type Options = {
  fromDate?: string
  toDate?: string
  institutionUid?: string
}

export function useProgramsNearEndDateReport(options?: Options) {
  const { called, loading, data, error, refetch } = useQuery(QUERY, {
    variables: options,
  })
  const count = data?.reports.programsNearEndDate.count ?? 0
  return { called, loading, count, error, refetch }
}
