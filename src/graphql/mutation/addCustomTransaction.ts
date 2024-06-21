import gql from 'graphql-tag'

const addCustomTransaction = gql`
  mutation addCustomTransaction($data: AddCustomTransactionData!) {
    addCustomTransaction(data: $data) {
      success
      message
    }
  }
`

export default addCustomTransaction