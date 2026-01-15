import { gql, useMutation } from '@apollo/client'
import { useCallback } from 'react'

const CREATE_ALIGNMENT = gql`
  mutation Alignment_useCreateInstitutionalToPND(
    $input: CreateAlignmentInstitutionalToPNDInput!
  ) {
    alignment {
      createInstitutionalToPND(input: $input) {
        id
        institutionalObjectiveUid
        pndObjectiveUid
        createdAt
      }
    }
  }
`

const DELETE_ALIGNMENT = gql`
  mutation Alignment_useDeleteInstitutionalToPND(
    $input: DeleteAlignmentInstitutionalToPNDInput!
  ) {
    alignment {
      deleteInstitutionalToPND(input: $input)
    }
  }
`

type SaveParams = {
  institutionalObjectiveUid: string
  nextSelected: string[]
  currentSelected: string[]
}

export function useSaveInstitutionalAlignments() {
  const [createAlignment, { loading: creating, error: createError }] =
    useMutation(CREATE_ALIGNMENT)
  const [deleteAlignment, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_ALIGNMENT)

  const saveAlignments = useCallback(
    async ({
      institutionalObjectiveUid,
      nextSelected,
      currentSelected,
    }: SaveParams) => {
      const nextSet = new Set(nextSelected)
      const currentSet = new Set(currentSelected)

      const toCreate = Array.from(nextSet).filter((uid) => !currentSet.has(uid))
      const toDelete = Array.from(currentSet).filter((uid) => !nextSet.has(uid))

      if (toCreate.length === 0 && toDelete.length === 0) {
        return { created: 0, deleted: 0 }
      }

      if (toCreate.length > 0) {
        await Promise.all(
          toCreate.map((pndObjectiveUid) =>
            createAlignment({
              variables: {
                input: { institutionalObjectiveUid, pndObjectiveUid },
              },
            }),
          ),
        )
      }

      if (toDelete.length > 0) {
        await Promise.all(
          toDelete.map((pndObjectiveUid) =>
            deleteAlignment({
              variables: {
                input: { institutionalObjectiveUid, pndObjectiveUid },
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
