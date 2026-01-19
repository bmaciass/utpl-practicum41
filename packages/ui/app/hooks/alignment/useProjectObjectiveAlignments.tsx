import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Alignment_useProjectObjectiveAlignments($projectObjectiveUid: String!) {
    projectObjective {
      one(uid: $projectObjectiveUid) {
        uid
        alignmentsToODS {
          id
          projectObjectiveUid
          odsObjectiveUid
          createdAt
        }
      }
    }
  }
`

export function useProjectObjectiveAlignments(
  projectObjectiveUid?: string,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { projectObjectiveUid },
    skip: !projectObjectiveUid || options?.skip,
  })

  return {
    alignments: data?.projectObjective.one?.alignmentsToODS ?? [],
    loading,
    error,
    refetch,
  }
}
