import gql from 'graphql-tag'

const chatMessages = gql`
  query chatMessages($chat_id: Float!) {
    chatMessages(chat_id: $chat_id) {
      id
      created_at
      image
      isRead
      message
      is_my_message
    }
  }
`

export default chatMessages