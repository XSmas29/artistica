import gql from 'graphql-tag'

const chats = gql`
  query chats {
    chats {
      id
      title
      custom_transaction {
        id
        status {
          id
          status
        }
        images {
          id
          path
        }
        product_name
        product_description
        amount
      }
    }
  }
`

export default chats