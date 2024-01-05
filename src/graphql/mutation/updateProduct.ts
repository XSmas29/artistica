import gql from 'graphql-tag'

const updateProduct = gql`
  mutation updateProduct($id: Float!, $data: ProductData!) {
    updateProduct(id: $id, data: $data) {
      message
      success
    }
  }
`

export default updateProduct