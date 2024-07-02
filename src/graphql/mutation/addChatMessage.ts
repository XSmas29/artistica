import gql from 'graphql-tag'

const addChatMessage = gql`
  mutation addChatMessage($data: ChatMessageData!) {
    addChatMessage(data: $data) {
      success
      message
      data
    }
  }
`

export default addChatMessage