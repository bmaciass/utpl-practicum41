import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation ObjectivePND_usePNDCreate($data: CreateObjectivePNDDataInput!) {
    objectivePND {
      create(data: $data) {
        uid
        name
        description
        active
      }
    }
  }
`

export function usePNDCreate() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const createPND = async (data: { name: string; description: string }) => {
    const result = await mutate({
      variables: { data },
      refetchQueries: ['ObjectivePND_usePNDList'],
    })
    return result.data?.objectivePND.create
  }

  return {
    createPND,
    loading,
    error,
  }
}
