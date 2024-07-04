import { gql } from 'graphql-tag'

const addQuotationMessage = gql`
  mutation addQuotationMessage(
    $id: Float!, 
    $price: Float!
  ) {
    addQuotationMessage(
      id: $id, 
      price: $price
    ) {
      success
      message
    }
  }
`

export default addQuotationMessage