import gql from 'graphql-tag'

const login = gql`
  mutation login($email: String!, $password: String! ) {
    login(email: $email, password: $password) {
      success
      message
      data
    }
  }
`

export default login