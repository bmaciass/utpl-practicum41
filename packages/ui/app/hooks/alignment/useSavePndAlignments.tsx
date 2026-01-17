import { gql, useMutation } from '@apollo/client'
import { useCallback } from 'react'

const CREATE_ALIGNMENT = gql`
  mutation Alignment_useCreatePNDToODS(
    $input: CreateAlignmentPNDToODSInput!
  ) {
    alignment {
      createPNDToODS(input: $input) {
        id
        pndObjectiveUid
        odsObjectiveUid
        createdAt
      }
    }
  }
`

const DELETE_ALIGNMENT = gql`
  mutation Alignment_useDeletePNDToODS(
    $input: DeleteAlignmentPNDToODSInput!
  ) {
    alignment {
      deletePNDToODS(input: $input)
    }
  }
`

type SaveParams = {
  pndObjectiveUid: string
  nextSelected: string[]
  currentSelected: string[]
}

export function useSavePndAlignments() {
  const [createAlignment, { loading: creating, error: createError }] =
    useMutation(CREATE_ALIGNMENT)
  const [deleteAlignment, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_ALIGNMENT)

  const saveAlignments = useCallback(
    async ({ pndObjectiveUid, nextSelected, currentSelected }: SaveParams) => {
      const nextSet = new Set(nextSelected)
      const currentSet = new Set(currentSelected)

      const toCreate = Array.from(nextSet).filter((uid) => !currentSet.has(uid))
      const toDelete = Array.from(currentSet).filter((uid) => !nextSet.has(uid))

      if (toCreate.length === 0 && toDelete.length === 0) {
        return { created: 0, deleted: 0 }
      }

      if (toCreate.length > 0) {
        await Promise.all(
          toCreate.map((odsObjectiveUid) =>
            createAlignment({
              variables: {
                input: { pndObjectiveUid, odsObjectiveUid },
              },
            }),
          ),
        )
      }

      if (toDelete.length > 0) {
        await Promise.all(
          toDelete.map((odsObjectiveUid) =>
            deleteAlignment({
              variables: {
                input: { pndObjectiveUid, odsObjectiveUid },
              },
            }),
          ),
        )
      }

      return { created: toCreate.length, deleted: toDelete.length }
    },
    [createAlignment, deleteAlignment],
  )

  return {
    saveAlignments,
    loading: creating || deleting,
    error: createError ?? deleteError,
  }
}
