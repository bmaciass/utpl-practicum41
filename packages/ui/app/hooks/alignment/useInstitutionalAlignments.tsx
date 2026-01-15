import { gql, useQuery } from '@apollo/client'

const QUERY = gql`
  query Alignment_useInstitutionalAlignments(
    $institutionalObjectiveUid: String!
  ) {
    institutionalObjective {
      one(uid: $institutionalObjectiveUid) {
        uid
        alignments {
          id
          institutionalObjectiveUid
          pndObjectiveUid
          createdAt
        }
      }
    }
  }
`

export function useInstitutionalAlignments(
  institutionalObjectiveUid?: string,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: { institutionalObjectiveUid },
    skip: !institutionalObjectiveUid || options?.skip,
  })

  return {
    alignments: data?.institutionalObjective.one?.alignments ?? [],
    loading,
    error,
    refetch,
  }
}
