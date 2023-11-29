import gql from 'graphql-tag'

const materials = gql`
  query materials {
    materials {
      id
      name
    }
  }
`

export default materials