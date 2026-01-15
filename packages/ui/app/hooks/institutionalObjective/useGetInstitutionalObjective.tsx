import { useQuery } from '@apollo/client'
import { graphql } from '~/gql'

const query = graphql(`
  query GetInstitutionalObjective_UseGetInstitutionalObjective($uid: String!) {
    institutionalObjective {
      one(uid: $uid) {
        uid
        name
        description
        active
        deletedAt
        institution {
          uid
          name
        }
      }
    }
  }
`)

export function useGetInstitutionalObjective(uid: string) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { uid },
    skip: !uid,
  })

  return {
    institutionalObjective: data?.institutionalObjective.one ?? null,
    loading,
    error,
    refetch,
  }
}
