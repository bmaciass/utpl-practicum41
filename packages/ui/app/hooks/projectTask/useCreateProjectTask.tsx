import { useMutation } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'
import { query } from './useProjectTaskList'

const createMutation = graphql(`
  mutation ProjectTask_useCreateProjectTask ($data: CreateProjectTaskDataInput!) {
    projectTask {
      create (data: $data) {
        uid
        name
        description
        responsible {
          uid
          name
        }
        active
      }
    }
  }
`)

export const useCreateProjectTask = (projectUid: string) => {
  const [fn, { called, loading, error, data }] = useMutation(createMutation, {
    refetchQueries: [{ query, variables: { projectUid } }],
  })

  const projectTask = data?.projectTask.create

  return { called, loading, error, projectTask, createProjectTask: fn }
}
