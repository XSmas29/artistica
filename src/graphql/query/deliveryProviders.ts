import gql from 'graphql-tag'

const deliveryProviders = gql`
  query deliveryProviders {
    deliveryProviders {
      id
      name
      code
    }
  }
`

export default deliveryProviders