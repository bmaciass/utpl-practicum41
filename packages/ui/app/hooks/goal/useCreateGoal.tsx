import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation Goal_useCreateGoal($data: CreateGoalDataInput!) {
    goal {
      create(data: $data) {
        uid
        name
        description
        active
      }
    }
  }
`

export function useCreateGoal() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const createGoal = async (data: {
    name: string
    description: string
    institutionalObjectiveUid: string
  }) => {
    const result = await mutate({
      variables: { data },
      refetchQueries: ['Goal_useGoalList'],
    })
    return result.data?.goal.create
  }

  return {
    createGoal,
    loading,
    error,
  }
}
