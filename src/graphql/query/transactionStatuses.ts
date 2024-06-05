import gql from 'graphql-tag'

const transactionStatuses = gql`
  query transactionStatuses {
    transactionStatuses {
      id
      status
    }
  }
`

export default transactionStatuses