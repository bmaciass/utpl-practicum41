import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation Goal_useUpdateGoal(
    $where: UpdateGoalWhereInput!
    $data: UpdateGoalDataInput!
  ) {
    goal {
      update(where: $where, data: $data) {
        uid
        name
        description
        active
      }
    }
  }
`

export function useUpdateGoal() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const updateGoal = async (
    uid: string,
    data: { name?: string; description?: string; active?: boolean },
  ) => {
    const result = await mutate({
      variables: { where: { uid }, data },
      refetchQueries: ['Goal_useGoalList'],
    })
    return result.data?.goal.update
  }

  return {
    updateGoal,
    loading,
    error,
  }
}
