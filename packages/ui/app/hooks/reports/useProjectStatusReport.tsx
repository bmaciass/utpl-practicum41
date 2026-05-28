import { gql, useQuery } from '@apollo/client'
import type { ProjectStatus } from '~/gql/graphql'

const QUERY = gql`
  query Reports_useProjectStatusReport($institutionUid: String) {
    reports {
      projectStatus(institutionUid: $institutionUid) {
        records {
          status
          count
        }
      }
    }
  }
`

type ProjectStatusRecord = {
  status: ProjectStatus
  count: number
}

const DEFAULT_RECORDS: ProjectStatusRecord[] = [
  { status: 'pending', count: 0 },
  { status: 'in_progress', count: 0 },
  { status: 'done', count: 0 },
  { status: 'cancelled', count: 0 },
]

export function useProjectStatusReport(options?: { institutionUid?: string }) {
  const { called, loading, data, error, refetch } = useQuery(QUERY, {
    variables: options,
  })
  const records = data?.reports.projectStatus.records ?? DEFAULT_RECORDS

  return { called, loading, records, error, refetch }
}
