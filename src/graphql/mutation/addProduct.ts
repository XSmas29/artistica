import gql from 'graphql-tag'

const addProduct = gql`
mutation addProduct($data: AddProductData!) {
  addProduct(data: $data) {
    message
    success
  }
}
`

export default addProduct