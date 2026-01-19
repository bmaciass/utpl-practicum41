import { gql, useMutation } from '@apollo/client'

const MUTATION = gql`
  mutation ProjectObjective_useUpdateProjectObjective(
    $where: UpdateProjectObjectiveWhereInput!
    $data: UpdateProjectObjectiveDataInput!
  ) {
    projectObjective {
      update(where: $where, data: $data) {
        uid
        name
        status
        active
      }
    }
  }
`

export function useUpdateProjectObjective() {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  const updateProjectObjective = async (
    uid: string,
    data: {
      name?: string
      status?: string
      active?: boolean
    },
  ) => {
    const result = await mutate({
      variables: { where: { uid }, data },
      refetchQueries: ['ProjectObjective_useProjectObjectiveList'],
    })

    return result.data?.projectObjective.update
  }

  return {
    updateProjectObjective,
    loading,
    error,
  }
}
