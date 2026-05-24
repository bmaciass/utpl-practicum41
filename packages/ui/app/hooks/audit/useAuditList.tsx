import { useQuery } from '@apollo/client/react/index.js'
import type { AuditEventFiltersInput } from '~/gql/graphql'
import { graphql } from '~/gql'

export const query = graphql(`
  query GetAuditList_useAuditList(
    $filters: AuditEventFiltersInput
    $limit: Int!
    $offset: Int!
  ) {
    audit {
      list(filters: $filters, limit: $limit, offset: $offset) {
        total
        records {
          uid
          createdAt
          status
          action
          resourceType
          resourceUid
          actorLabel
          actorUser {
            uid
            name
            person {
              firstName
              lastName
            }
          }
        }
      }
    }
  }
`)

type UseAuditListOptions = {
  filters?: AuditEventFiltersInput
  limit?: number
  offset?: number
}

export const useAuditList = ({
  filters,
  limit = 50,
  offset = 0,
}: UseAuditListOptions = {}) => {
  const { called, loading, data, error, refetch } = useQuery(query, {
    variables: {
      filters,
      limit,
      offset,
    },
  })

  return {
    called,
    loading,
    total: data?.audit.list.total ?? 0,
    auditEvents: data?.audit.list.records ?? [],
    error,
    refetch,
  }
}
