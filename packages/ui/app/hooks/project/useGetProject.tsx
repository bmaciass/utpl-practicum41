import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

const query = graphql(`
  query GetProjects_useGetProject ($id: String!) {
    project {
      one (id: $id) {
        uid
        name
        description
        status
        startDate
        endDate
        program {
          uid
        }
        responsible {
          uid
          name
        }
        active
      }
    }
  }
`)

export const useGetProject = (id: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { id },
  })

  return { called, loading, project: data?.project.one, error }
}
