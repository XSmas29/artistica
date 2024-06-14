import gql from 'graphql-tag'

const transactionDetail = gql`
  query transactionDetail(
    $transaction_id: String!
  ) {
    transactionDetail(
      transaction_id: $transaction_id
    ) {
      id
      total_price
      created_at
      customer_email
      customer_name
      customer_phone
      payment_method
      shipping_address
      shipping_city
      shipping_cost
      shipping_postal_code
      shipping_service
      details {
        id
        price
        quantity
        variant {
          image {
            id
            path
          }
          id
          sku
          stock
          product {
            id
            name
            slug
            images {
              id
              path
            }
          }
        }
      }
      status {
        id
        status
      }
      user {
        id
      }
    }
  }
`

export default transactionDetail