import gql from 'graphql-tag'

const editPassword = gql`
  mutation editPassword($data: EditPasswordData!) {
    editPassword(data: $data) {
      success
      message
      data
    }
  }
`

export default editPassword