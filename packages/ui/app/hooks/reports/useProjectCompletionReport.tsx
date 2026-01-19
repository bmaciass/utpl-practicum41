import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Reports_useProjectCompletionReport($projectUid: String!) {
    reports {
      projectCompletion(projectUid: $projectUid) {
        completed
        total
        percentage
      }
    }
  }
`

type ProjectCompletionReport = {
  completed: number
  total: number
  percentage: number
}

export function useProjectCompletionReport(projectUid: string) {
  const { called, loading, data, error, refetch } = useQuery(QUERY, {
    variables: { projectUid },
  })

  const report = data?.reports.projectCompletion ?? null

  return {
    called,
    loading,
    report: report as ProjectCompletionReport | null,
    error,
    refetch,
  }
}
