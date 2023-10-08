import gql from 'graphql-tag'

const register = gql`
  mutation register($email: String!) {
    register(email: $email) {
      success
      message
      data
    }
  }
`

export default register