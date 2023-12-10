import gql from 'graphql-tag'

const cartData = gql`
  query cartData($data: [CartParams!]!) {
    cartData(data: $data) {
      quantity
      variant {
        id
        name
        price
        stock
        images {
          id
          path
        }
        product {
          id
          name
          images {
            id
            path
          }
          single_variant
        }
      }
    }
  }
`

export default cartData