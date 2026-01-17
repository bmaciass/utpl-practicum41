import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation Indicator_useDeleteIndicator($input: DeleteIndicatorInput!) {
    indicator {
      delete(input: $input)
    }
  }
`

export function useDeleteIndicator() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const deleteIndicator = async (uid: string) => {
    await mutate({
      variables: { input: { uid } },
      refetchQueries: ['Indicator_useIndicatorList'],
    })
  }

  return {
    deleteIndicator,
    loading,
    error,
  }
}
