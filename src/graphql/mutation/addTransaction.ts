import gql from 'graphql-tag'

const addTransaction = gql`
  mutation addTransaction(
    $transaction_data: TransactionData!, 
    $item_data: [TransactionItemData!]!
  ) {
    addTransaction(
      transaction_data: $transaction_data, 
      item_data: $item_data, 
    ) {
      message
      success
    }
  }
`

export default addTransaction