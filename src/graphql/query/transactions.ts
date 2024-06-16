import gql from 'graphql-tag'

const transactions = gql`
  query transactions(
    $filter: filterTransaction!,
    $sort: sort!,
    $pagination: pagination!,
  ) {
    transactions(
      filter: $filter,
      sort: $sort,
      pagination: $pagination,
    ) {
      count
      transactions {
        id
        customer_name
        customer_email
        customer_phone
        created_at
        total_price
        shipping_cost
        status {
          id
          status
        }
      }
    }
  }
`

export default transactions