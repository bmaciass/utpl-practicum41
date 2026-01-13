import { useMutation } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'
import { query } from './useProgramList'

const updateMutation = graphql(`
  mutation UpdateProgram_useUpdateProgram ($data: UpdateProgramDataInput!, $where: UpdateProgramWhereInput!) {
    program {
      update (data: $data, where: $where) {
        uid
        name
        description
        responsible {
          uid
        }
        active
      }
    }
  }
`)

export const useUpdateProgram = () => {
  const [fn, { called, loading, error, data }] = useMutation(updateMutation, {
    refetchQueries: [{ query }],
  })

  const program = data?.program.update

  return { called, loading, error, program, updateProgram: fn }
}
