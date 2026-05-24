import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

const query = graphql(`
  query GetAudit_useGetAudit($uid: String!) {
    audit {
      one(uid: $uid) {
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
            dni
            firstName
            lastName
          }
        }
        requestPayload
        beforeSnapshot
        afterSnapshot
        error
        metadata
      }
    }
  }
`)

export const useGetAudit = (uid: string) => {
  const { called, loading, data, error, refetch } = useQuery(query, {
    variables: { uid },
  })

  return {
    called,
    loading,
    auditEvent: data?.audit.one,
    error,
    refetch,
  }
}
