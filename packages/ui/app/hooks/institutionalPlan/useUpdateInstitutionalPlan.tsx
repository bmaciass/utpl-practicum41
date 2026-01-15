import { useMutation } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'
import { query } from './useInstitutionalPlanList'

const updateMutation = graphql(`
  mutation UpdateInstitutionalPlan_useSaveInstitutionalPlan ($data: UpdateInstitutionalPlanDataInput!, $where: UpdateInstitutionalPlanWhereInput!) {
    institutionalPlan {
      update (data: $data, where: $where) {
        uid
        name
      }
    }
  }
`)

export const useUpdateInstitutionalPlan = () => {
  const [fn, { called, loading, error, data }] = useMutation(updateMutation, {
    refetchQueries: [{ query }],
  })

  const institutionalPlan = data?.institutionalPlan.update

  return {
    called,
    loading,
    error,
    institutionalPlan,
    updateInstitutionalPlan: fn,
  }
}
