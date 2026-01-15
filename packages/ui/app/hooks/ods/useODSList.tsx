import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

export const query = graphql(`
  query ObjectiveODS_useODSList {
    objectiveODS {
      list {
        records {
          uid
          name
          description
          active
        }
      }
    }
  }
`)

export const useODSList = () => {
  const { called, loading, data, error } = useQuery(query)

  return {
    called,
    loading,
    odsList: data?.objectiveODS.list.records ?? [],
    error,
  }
}
