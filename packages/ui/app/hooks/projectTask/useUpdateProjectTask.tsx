import type { MutationFunctionOptions } from '@apollo/client'
import { useMutation } from '@apollo/client/react/index.js'
import { useCallback } from 'react'
import { graphql } from '~/gql'
import type {
  ProjectTask_UseProjectTaskListQuery,
  ProjectTask_UseUpdateProjectTaskMutation,
  ProjectTask_UseUpdateProjectTaskMutationVariables,
  ProjectTaskStatus,
} from '~/gql/graphql'
import { query } from './useProjectTaskList'

const updateMutation = graphql(`
  mutation ProjectTask_useUpdateProjectTask ($data: UpdateProjectTaskDataInput!, $where: UpdateProjectTaskWhereInput!) {
    projectTask {
      update (data: $data, where: $where) {
        uid
        name
        description
        status
        responsible {
          uid
          name
        }
        active
      }
    }
  }
`)

function updateProjectTaskListCache(
  currentData: ProjectTask_UseProjectTaskListQuery | null,
  updatedTask: ProjectTask_UseUpdateProjectTaskMutation['projectTask']['update'],
) {
  if (!currentData) {
    return currentData
  }

  const records = currentData.projectTask.list.records
  const nextRecords = updatedTask.active
    ? records.map((record) =>
        record.uid === updatedTask.uid
          ? {
              ...record,
              name: updatedTask.name,
              description: updatedTask.description,
              status: updatedTask.status,
              responsible: updatedTask.responsible,
            }
          : record,
      )
    : records.filter((record) => record.uid !== updatedTask.uid)

  return {
    ...currentData,
    projectTask: {
      ...currentData.projectTask,
      list: {
        ...currentData.projectTask.list,
        records: nextRecords,
      },
    },
  }
}

export const useUpdateProjectTask = (projectUid: string) => {
  const [mutate, { called, loading, error, data }] = useMutation<
    ProjectTask_UseUpdateProjectTaskMutation,
    ProjectTask_UseUpdateProjectTaskMutationVariables
  >(updateMutation, {
    update(cache, { data: mutationData }) {
      const updatedTask = mutationData?.projectTask.update
      if (!updatedTask) {
        return
      }

      cache.updateQuery<ProjectTask_UseProjectTaskListQuery>(
        {
          query,
          variables: { projectUid },
        },
        (currentData) => updateProjectTaskListCache(currentData, updatedTask),
      )
    },
  })

  const updateProjectTask = useCallback(
    (
      options?: MutationFunctionOptions<
        ProjectTask_UseUpdateProjectTaskMutation,
        ProjectTask_UseUpdateProjectTaskMutationVariables
      >,
    ) => mutate(options),
    [mutate],
  )

  const changeProjectTaskStatus = useCallback(
    ({
      taskUid,
      status,
      onCompleted,
      onError,
    }: {
      taskUid: string
      status: ProjectTaskStatus
      onCompleted?: MutationFunctionOptions<
        ProjectTask_UseUpdateProjectTaskMutation,
        ProjectTask_UseUpdateProjectTaskMutationVariables
      >['onCompleted']
      onError?: MutationFunctionOptions<
        ProjectTask_UseUpdateProjectTaskMutation,
        ProjectTask_UseUpdateProjectTaskMutationVariables
      >['onError']
    }) =>
      updateProjectTask({
        variables: {
          data: { status },
          where: { uid: taskUid },
        },
        onCompleted,
        onError,
      }),
    [updateProjectTask],
  )

  const projectTask = data?.projectTask.update

  return {
    called,
    loading,
    error,
    projectTask,
    updateProjectTask,
    changeProjectTaskStatus,
  }
}
