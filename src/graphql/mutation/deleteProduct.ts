import gql from 'graphql-tag'

const deleteProduct = gql`
mutation deleteProduct($id: Float!) {
  deleteProduct(id: $id) {
    message
    success
  }
}
`

export default deleteProduct