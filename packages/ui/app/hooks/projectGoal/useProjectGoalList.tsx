import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

export const query = graphql(`
  query ProjectGoal_useProjectGoalList ($projectUid: String!) {
    projectGoal {
      list (projectUid: $projectUid) {
        records {
          uid
          name
          # project {
            # uid
          # }
        }
      }
    }
  }
`)

export const useProjectGoalList = (projectUid: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { projectUid },
  })

  return {
    called,
    loading,
    projectGoals: data?.projectGoal.list.records ?? [],
    error,
  }
}
