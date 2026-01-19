import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query ProjectObjective_useGetProjectObjective($uid: String!) {
    projectObjective {
      one(uid: $uid) {
        uid
        name
        status
        active
        deletedAt
      }
    }
  }
`

export function useGetProjectObjective(uid?: string) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { uid },
    skip: !uid,
  })

  return {
    objective: data?.projectObjective.one ?? null,
    loading,
    error,
    refetch,
  }
}
