import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

const query = graphql(`
  query GetPrograms_useGetProgram ($id: String!) {
    program {
      one (id: $id) {
        uid
        name
        description
        startDate
        endDate
        estimatedInversion
        responsible {
          uid
        }
        active
      }
    }
  }
`)

export const useGetProgram = (id: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { id },
  })

  return { called, loading, program: data?.program.one, error }
}
