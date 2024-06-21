import gql from 'graphql-tag'

const chats = gql`
  query chats {
    chats {
      id
      title
    }
  }
`

export default chats