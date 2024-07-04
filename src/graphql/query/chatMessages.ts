import gql from 'graphql-tag'

const chatMessages = gql`
  query chatMessages($chat_id: Float!) {
    chatMessages(chat_id: $chat_id) {
      id
      created_at
      image
      message
      is_my_message
      quotation_price
      is_quotation_active
      chat {
        custom_transaction {
          id
          product_name
          images {
            id
            path
          }
          amount
        }
      }
    }
  }
`

export default chatMessages