import gql from 'graphql-tag'

const profileInfo = gql`
  query profileInfo {
    profileInfo {
      id
      email
      first_name
      last_name
      phone
      created_at
      is_verified
      is_admin
      hash
    }
  }
`

export default profileInfo
