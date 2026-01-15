import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

export const query = graphql(`
  query ProjectTask_useProjectTaskList ($projectUid: String!) {
    projectTask {
      list (projectUid: $projectUid) {
        records {
          uid
          name
          description
          status
          startDate
          endDate
          responsible {
            uid
            name
          }
        }
      }
    }
  }
`)

export const useProjectTaskList = (projectUid: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { projectUid },
  })

  return {
    called,
    loading,
    projectTasks: data?.projectTask.list.records ?? [],
    error,
  }
}
