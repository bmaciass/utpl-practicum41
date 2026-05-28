import { gql, useQuery } from '@apollo/client'
import type { ProjectTaskStatus } from '~/gql/graphql'

const QUERY = gql`
  query Reports_useTaskStatusReport($institutionUid: String) {
    reports {
      taskStatus(institutionUid: $institutionUid) {
        records {
          status
          count
        }
      }
    }
  }
`

type TaskStatusRecord = {
  status: ProjectTaskStatus
  count: number
}

const DEFAULT_RECORDS: TaskStatusRecord[] = [
  { status: 'pending', count: 0 },
  { status: 'in_progress', count: 0 },
  { status: 'reviewing', count: 0 },
  { status: 'done', count: 0 },
  { status: 'cancelled', count: 0 },
]

export function useTaskStatusReport(options?: { institutionUid?: string }) {
  const { called, loading, data, error, refetch } = useQuery(QUERY, {
    variables: options,
  })
  const records = data?.reports.taskStatus.records ?? DEFAULT_RECORDS

  return { called, loading, records, error, refetch }
}
