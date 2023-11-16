import gql from 'graphql-tag'

const login = gql`
  mutation login($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
      success
      message
      token
      refresh_token
    }
  }
`

export default login