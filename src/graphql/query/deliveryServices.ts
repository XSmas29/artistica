import gql from 'graphql-tag'

const deliveryServices = gql`
  query deliveryServices($param: ParamDeliveryService!) {
    deliveryServices(param: $param) {
      service
      cost
      description
      etd
      note
    }
  }
`

export default deliveryServices