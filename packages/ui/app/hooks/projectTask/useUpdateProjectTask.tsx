import { useMutation } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'
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

export const useUpdateProjectTask = (projectUid: string) => {
  const [fn, { called, loading, error, data }] = useMutation(updateMutation, {
    refetchQueries: [{ query, variables: { projectUid } }],
  })

  const projectTask = data?.projectTask.update

  return { called, loading, error, projectTask, updateProjectTask: fn }
}
