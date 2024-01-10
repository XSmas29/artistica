import gql from 'graphql-tag'

export const users = gql`
  query users($filter: filterUsers, $pagination: pagination) {
    users(filter: $filter, pagination: $pagination) {
      count
      users {
        id
        email
        phone
        first_name
        last_name
        created_at
        updated_at
        is_verified
      }
    }
  }
`

export default users