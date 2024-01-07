import gql from 'graphql-tag'

const updateCategory = gql`
  mutation updateCategory($id: Float!, $data: CategoryData!) {
    updateCategory(id: $id, data: $data) {
      success
      message
    }
  }
`

export default updateCategory