import { useMutation } from '@apollo/client'
import { graphql } from '~/gql'

const updateMutation = graphql(`
  mutation UpdateInstitutionalObjective_UseUpdateInstitutionalObjective(
    $where: UpdateInstitutionalObjectiveWhereInput!
    $data: UpdateInstitutionalObjectiveDataInput!
  ) {
    institutionalObjective {
      update(where: $where, data: $data) {
        uid
        name
        description
        active
        deletedAt
      }
    }
  }
`)

const listQuery = graphql(`
  query InstitutionalObjectiveList_UseUpdateInstitutionalObjective($active: Boolean, $institutionUid: String) {
    institutionalObjective {
      list(active: $active, institutionUid: $institutionUid) {
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

export function useUpdateInstitutionalObjective(institutionUid: string) {
  const [fn, { called, loading, error, data }] = useMutation(updateMutation, {
    refetchQueries: [
      { query: listQuery, variables: { active: true, institutionUid } },
    ],
  })

  return {
    update: fn,
    called,
    loading,
    error,
    data,
  }
}
