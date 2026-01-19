import { useCallback } from 'react'
import { useUpdateProjectObjective } from './useUpdateProjectObjective'

export function useDeleteProjectObjective() {
  const { updateProjectObjective, loading, error } = useUpdateProjectObjective()

  const deleteProjectObjective = useCallback(
    async (uid: string) => {
      return updateProjectObjective(uid, { active: false })
    },
    [updateProjectObjective],
  )

  return {
    deleteProjectObjective,
    loading,
    error,
  }
}
