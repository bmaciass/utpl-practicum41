import { useQuery } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'

const query = graphql(`
  query GetInstitutionalPlan_useGetInstitutionalPlan ($uid: String!) {
    institutionalPlan {
      one (uid: $uid) {
        uid
        name
        year
        url
      }
    }
  }
`)

export const useGetInstitutionalPlan = (uid: string) => {
  const { called, loading, data, error } = useQuery(query, {
    variables: { uid },
  })

  return {
    called,
    loading,
    institutionalPlan: data?.institutionalPlan.one,
    error,
  }
}
