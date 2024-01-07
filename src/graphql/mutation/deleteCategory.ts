import gql from 'graphql-tag'

const deleteCategory = gql`
  mutation deleteCategory($id: Float!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`

export default deleteCategory