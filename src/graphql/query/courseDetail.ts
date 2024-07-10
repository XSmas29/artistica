import gql from 'graphql-tag'

const courseDetail = gql`
  query courseDetail($id: Float!) {
    courseDetail(id: $id) {
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

export default courseDetail