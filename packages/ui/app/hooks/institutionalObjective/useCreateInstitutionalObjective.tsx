import { useMutation } from '@apollo/client'
import { graphql } from '~/gql'

const createMutation = graphql(`
  mutation CreateInstitutionalObjective_UseCreateInstitutionalObjective($data: CreateInstitutionalObjectiveDataInput!) {
    institutionalObjective {
      create(data: $data) {
        uid
        name
        description
        active
      }
    }
  }
`)

const listQuery = graphql(`
  query InstitutionalObjectiveList_UseCreateInstitutionalObjective($active: Boolean, $institutionUid: String) {
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

export function useCreateInstitutionalObjective() {
  const [fn, { called, loading, error, data }] = useMutation(createMutation, {
    refetchQueries: [{ query: listQuery }],
  })

  return {
    create: fn,
    called,
    loading,
    error,
    data,
  }
}
