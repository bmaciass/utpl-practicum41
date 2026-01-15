import { useQuery } from '@apollo/client'
import { graphql } from '~/gql'

const query = graphql(`
  query InstitutionalObjectiveList_UseInstitutionalObjectiveList($active: Boolean, $institutionUid: String) {
    institutionalObjective {
      list(active: $active, institutionUid: $institutionUid) {
        records {
          uid
          name
          description
          active
          deletedAt
        }
      }
    }
  }
`)

export function useInstitutionalObjectiveList(variables?: {
  active?: boolean
  institutionUid?: string
}) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-and-network',
  })

  return {
    list: data?.institutionalObjective.list.records ?? [],
    loading,
    error,
    refetch,
  }
}
