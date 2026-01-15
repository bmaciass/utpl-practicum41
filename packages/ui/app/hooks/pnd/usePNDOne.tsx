import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query ObjectivePND_usePNDOne($uid: String!) {
    objectivePND {
      one(uid: $uid) {
        uid
        name
        description
        active
        deletedAt
      }
    }
  }
`

export function usePNDOne(uid?: string) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { uid },
    skip: !uid,
  })

  return {
    objective: data?.objectivePND.one ?? null,
    loading,
    error,
    refetch,
  }
}
