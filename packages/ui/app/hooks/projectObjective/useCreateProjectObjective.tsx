import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation ProjectObjective_useCreateProjectObjective(
    $data: CreateProjectObjectiveDataInput!
  ) {
    projectObjective {
      create(data: $data) {
        uid
        name
        status
        active
      }
    }
  }
`

export function useCreateProjectObjective() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const createProjectObjective = async (data: {
    name: string
    status: string
    projectUid: string
  }) => {
    const result = await mutate({
      variables: { data },
      refetchQueries: ['ProjectObjective_useProjectObjectiveList'],
    })

    return result.data?.projectObjective.create
  }

  return {
    createProjectObjective,
    loading,
    error,
  }
}
