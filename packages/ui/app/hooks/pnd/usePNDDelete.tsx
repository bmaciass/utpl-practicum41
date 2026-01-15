import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation ObjectivePND_usePNDDelete($input: DeleteObjectivePNDInput!) {
    objectivePND {
      delete(input: $input)
    }
  }
`

export function usePNDDelete() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const deletePND = async (uid: string) => {
    await mutate({
      variables: {
        input: { uid },
      },
      refetchQueries: ['ObjectivePND_usePNDList'],
    })
  }

  return {
    deletePND,
    loading,
    error,
  }
}
