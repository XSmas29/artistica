import gql from 'graphql-tag'

const courses = gql`
  query courses {
    courses {
      id
      name
      description
      price
      price_promo
      promo_min_amount
      time
    }
  }
`

export default courses