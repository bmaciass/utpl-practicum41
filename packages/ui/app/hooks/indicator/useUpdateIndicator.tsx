import { gql, useMutation } from '@apollo/client'
import type { IndicatorType } from '~/gql/graphql'

const MUTATION = gql`
  mutation Indicator_useUpdateIndicator(
    $where: UpdateIndicatorWhereInput!
    $data: UpdateIndicatorDataInput!
  ) {
    indicator {
      update(where: $where, data: $data) {
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

export function useUpdateIndicator() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const updateIndicator = async (
    uid: string,
    data: {
      name?: string
      description?: string | null
      type?: IndicatorType | null
      unitType?: string | null
      minValue?: number | null
      maxValue?: number | null
      active?: boolean
    },
  ) => {
    const result = await mutate({
      variables: { where: { uid }, data },
      refetchQueries: ['Indicator_useIndicatorList'],
    })
    return result.data?.indicator.update
  }

  return {
    updateIndicator,
    loading,
    error,
  }
}
