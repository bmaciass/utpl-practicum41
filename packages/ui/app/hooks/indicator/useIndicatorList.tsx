import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Indicator_useIndicatorList(
    $goalUid: String!
    $active: Boolean!
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    indicator {
      list(
        filters: { goalUid: $goalUid, active: $active, search: $search }
        limit: $limit
        offset: $offset
      ) {
        records {
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
  }
`

export function useIndicatorList(
  goalUid?: string,
  {
    active = true,
    search = '',
    limit = 100,
    offset = 0,
  }: {
    active?: boolean
    search?: string
    limit?: number
    offset?: number
  } = {},
) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      goalUid,
      active,
      search,
      limit,
      offset,
    },
    skip: !goalUid,
  })

  return {
    list: data?.indicator.list.records ?? [],
    loading,
    error,
    refetch,
  }
}
