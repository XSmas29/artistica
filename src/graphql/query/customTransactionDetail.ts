import gql from 'graphql-tag'

const customTransactionDetail = gql`
  query customTransactionDetail($id: Float!) {
    customTransactionDetail(id: $id) {
      id
      images {
        id
        path
      }
      product_name
      product_description
      amount
    }
  }
`

export default customTransactionDetail