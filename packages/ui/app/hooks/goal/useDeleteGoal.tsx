import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation Goal_useDeleteGoal($input: DeleteGoalInput!) {
    goal {
      delete(input: $input)
    }
  }
`

export function useDeleteGoal() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const deleteGoal = async (uid: string) => {
    await mutate({
      variables: { input: { uid } },
      refetchQueries: ['Goal_useGoalList'],
    })
  }

  return {
    deleteGoal,
    loading,
    error,
  }
}
