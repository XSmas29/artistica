import gql from 'graphql-tag'

const products = gql`
  query products(
    $filter: filterProducts!
    $pagination: pagination!
    $sort: sort!
  ) {
    products(
      filter: $filter
      pagination: $pagination
      sort: $sort
    ) {
      count
      price_min
      price_max
      products {
        id
        name
        description
        slug
        single_variant
        images {
          id
          path
        }
        variants {
          id
          price
        }
      }
    }
  }
`

export default products