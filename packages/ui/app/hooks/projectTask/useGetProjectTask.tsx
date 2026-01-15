import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

const query = graphql(`
  query ProjectTask_useGetProjectTask ($uid: String!) {
    projectTask {
      one (uid: $uid) {
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
        active
      }
    }
  }
`)

export const useGetProjectTask = (uid: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { uid },
  })

  return { called, loading, projectTask: data?.projectTask.one, error }
}
