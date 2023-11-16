import gql from 'graphql-tag'

const refreshToken = gql`
  query refreshToken($refresh_token: String!) {
    refreshToken(refresh_token: $refresh_token) {
      token
      refresh_token
    }
  }
`

export default refreshToken