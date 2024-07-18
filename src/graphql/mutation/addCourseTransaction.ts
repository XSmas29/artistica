import gql from 'graphql-tag'

const addCourseTransaction = gql`
  mutation addCourseTransaction(
    $transaction_data: CourseTransactionData!, 
    $item_data: CourseTransactionItemData!
  ) {
    addCourseTransaction(
      transaction_data: $transaction_data, 
      item_data: $item_data, 
    ) {
      message
      success
    }
  }
`

export default addCourseTransaction