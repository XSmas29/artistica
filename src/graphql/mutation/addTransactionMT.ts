import gql from 'graphql-tag'

const addTransactionMT = gql`
  mutation addTransactionMT(
    $transaction_detail: TransactionDetailMT!
    $item_details: [ItemDetailMT!]
    $customer_detail: CustomerDetailMT
    $credit_card: CreditCardMT
  ) {
    addTransactionMT(
      transaction_detail: $transaction_detail
      item_details: $item_details
      customer_detail: $customer_detail
      credit_card: $credit_card
    ) {
      token
      redirect_url
    }
  }
`

export default addTransactionMT