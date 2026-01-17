import { useMutation } from '@apollo/client/react/index.js'
import { graphql } from '~/gql'
import { query } from './useUserList'

const deleteMutation = graphql(`
  mutation DeleteUser_useDeleteUser($input: DeleteUserInput!) {
    user {
      delete(input: $input)
    }
  }
`)

export const useDeleteUser = () => {
  const [fn, { called, loading, error }] = useMutation(deleteMutation, {
    refetchQueries: [{ query }],
  })

  const deleteUser = async (uid: string) => {
    await fn({ variables: { input: { uid } } })
  }

  return { called, loading, error, deleteUser }
}
