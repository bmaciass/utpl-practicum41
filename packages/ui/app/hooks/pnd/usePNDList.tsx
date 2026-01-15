import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query ObjectivePND_usePNDList {
    objectivePND {
      list {
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
`

export function usePNDList() {
  const { called, loading, data, error, refetch } = useQuery(QUERY)

  return {
    called,
    loading,
    data: data?.objectivePND.list.records ?? [],
    error,
    refetch,
  }
}
