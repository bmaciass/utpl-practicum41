import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query ProjectObjective_useProjectObjectiveList(
    $projectUid: String!
    $active: Boolean!
    $status: ProjectObjectiveStatus
  ) {
    projectObjective {
      list(projectUid: $projectUid, active: $active, status: $status) {
        records {
          uid
          name
          status
          active
        }
      }
    }
  }
`

export function useProjectObjectiveList(
  projectUid?: string,
  {
    active = true,
    status,
  }: {
    active?: boolean
    status?: string
  } = {},
) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      projectUid,
      active,
      status,
    },
    skip: !projectUid,
  })

  return {
    list: data?.projectObjective.list.records ?? [],
    loading,
    error,
    refetch,
  }
}
