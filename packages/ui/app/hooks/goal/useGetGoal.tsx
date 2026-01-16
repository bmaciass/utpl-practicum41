import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Goal_useGetGoal($uid: String!) {
    goal {
      one(uid: $uid) {
        uid
        name
        description
        active
      }
    }
  }
`

export function useGetGoal(uid?: string) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { uid },
    skip: !uid,
  })

  return {
    goal: data?.goal.one ?? null,
    loading,
    error,
    refetch,
  }
}
