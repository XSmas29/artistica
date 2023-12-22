import gql from 'graphql-tag'

const cartData = gql`
  query cartData($data: [CartParams!]!) {
    cartData(data: $data) {
      quantity
      variant {
        id
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
        attribute_values {
          id
          attribute {
            id
            name
          }
          option {
            id
            name
          }
        }
      }
    }
  }
`

export default cartData