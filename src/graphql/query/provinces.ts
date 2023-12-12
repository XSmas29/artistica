import gql from 'graphql-tag'

const provinces = gql`
  query provinces {
    provinces {
      province_id
      province
    }
  }
`

export default provinces