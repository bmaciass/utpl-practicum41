import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

export const query = graphql(`
  query GetInstitutionalPlan_useInstitutionalPlanList ($institutionUid: String!) {
    institutionalPlan {
      list (institutionUid: $institutionUid) {
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
    variables: { institutionUid },
  })

  return {
    called,
    loading,
    institutionalPlans: data?.institutionalPlan.list.records ?? [],
    error,
  }
}
