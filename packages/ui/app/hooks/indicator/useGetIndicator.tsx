import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Indicator_useGetIndicator($uid: String!) {
    indicator {
      one(uid: $uid) {
        uid
        name
        description
        type
        unitType
        minValue
        maxValue
        active
      }
    }
  }
`

export function useGetIndicator(uid?: string) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { uid },
    skip: !uid,
  })

  return {
    indicator: data?.indicator.one ?? null,
    loading,
    error,
    refetch,
  }
}
