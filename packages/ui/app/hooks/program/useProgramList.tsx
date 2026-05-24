import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

export const query = graphql(`
  query GetProgramList_useProgramList($institutionUid: String) {
    program {
      list(institutionUid: $institutionUid) {
        records {
          uid
          name
        }
      }
    }
  }
`)

export const useProgramList = (variables?: { institutionUid?: string }) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: variables?.institutionUid
      ? { institutionUid: variables.institutionUid }
      : undefined,
  })

  return { called, loading, programs: data?.program.list.records ?? [], error }
}
