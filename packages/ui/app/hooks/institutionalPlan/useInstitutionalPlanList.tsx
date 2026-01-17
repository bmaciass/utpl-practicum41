import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

export const query = graphql(`
  query GetInstitutionalPlan_useInstitutionalPlanList ($institutionUid: String!, $active: Boolean!) {
    institutionalPlan {
      list (institutionUid: $institutionUid, active: $active) {
        records {
          uid
          name
        }
      }
    }
  }
`)

export const useInstitutionalPlanList = (institutionUid: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { institutionUid, active: true },
  })

  return {
    called,
    loading,
    institutionalPlans: data?.institutionalPlan.list.records ?? [],
    error,
  }
}
