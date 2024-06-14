import gql from 'graphql-tag'

const updateTransactionStatus = gql`
  mutation updateTransactionStatus($transaction_id: String!, $status_id: Float!) {
    updateTransactionStatus(transaction_id: $transaction_id, status_id: $status_id) {
      message
      success
    }
  }
`

export default updateTransactionStatus