import gql from 'graphql-tag'

const updateCustomTransactionBasicInfo = gql`
  mutation updateCustomTransactionBasicInfo(
    $id: Float!
    $data: UpdateCustomTransactionData!
  ) {
    updateCustomTransactionBasicInfo(
      id: $id
      data: $data
    ) {
      success
      message
    }
  }
`

export default updateCustomTransactionBasicInfo