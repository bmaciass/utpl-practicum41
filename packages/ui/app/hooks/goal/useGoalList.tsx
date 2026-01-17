import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Goal_useGoalList(
    $institutionalObjectiveUid: String!
    $active: Boolean!
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    goal {
      list(
        filters: {
          institutionalObjectiveUid: $institutionalObjectiveUid
          active: $active
          search: $search
        }
        limit: $limit
        offset: $offset
      ) {
        records {
          uid
          name
          description
          active
        }
      }
    }
  }
`

export function useGoalList(
  institutionalObjectiveUid?: string,
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
      institutionalObjectiveUid,
      active,
      search,
      limit,
      offset,
    },
    skip: !institutionalObjectiveUid,
  })

  return {
    list: data?.goal.list.records ?? [],
    loading,
    error,
    refetch,
  }
}
