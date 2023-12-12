import gql from 'graphql-tag'

const cities = gql`
  query cities($provinceId: Float!) {
    cities(provinceId: $provinceId) {
      city_id
      province_id
      province
      type
      city_name
      postal_code
    }
  }
`

export default cities