import { gql, useMutation } from '@apollo/client'
import type { IndicatorType } from '~/gql/graphql'

const MUTATION = gql`
  mutation Indicator_useCreateIndicator($data: CreateIndicatorDataInput!) {
    indicator {
      create(data: $data) {
        uid
        name
        description
        type
        unitType
        minValue
        maxValue
        active
      }
    }
  }
`

export function useCreateIndicator() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const createIndicator = async (data: {
    name: string
    description?: string | null
    type?: IndicatorType | null
    unitType?: string | null
    minValue?: number | null
    maxValue?: number | null
    goalUid: string
  }) => {
    const result = await mutate({
      variables: { data },
      refetchQueries: ['Indicator_useIndicatorList'],
    })
    return result.data?.indicator.create
  }

  return {
    createIndicator,
    loading,
    error,
  }
}
