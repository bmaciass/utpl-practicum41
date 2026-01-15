import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Alignment_usePndAlignments($pndObjectiveUid: String!) {
    objectivePND {
      one(uid: $pndObjectiveUid) {
        uid
        alignmentsToODS {
          id
          pndObjectiveUid
          odsObjectiveUid
          createdAt
        }
      }
    }
  }
`

export function usePndAlignments(
  pndObjectiveUid?: string,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { pndObjectiveUid },
    skip: !pndObjectiveUid || options?.skip,
  })

  return {
    alignments: data?.objectivePND.one?.alignmentsToODS ?? [],
    loading,
    error,
    refetch,
  }
}
