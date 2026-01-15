import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation ObjectivePND_usePNDUpdate(
    $where: UpdateObjectivePNDWhereInput!
    $data: UpdateObjectivePNDDataInput!
  ) {
    objectivePND {
      update(where: $where, data: $data) {
        uid
        name
        description
        active
      }
    }
  }
`

export function usePNDUpdate() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const updatePND = async (
    uid: string,
    data: { name?: string; description?: string; active?: boolean },
  ) => {
    const result = await mutate({
      variables: {
        where: { uid },
        data,
      },
      refetchQueries: ['ObjectivePND_usePNDList'],
    })
    return result.data?.objectivePND.update
  }

  return {
    updatePND,
    loading,
    error,
  }
}
