import gql from 'graphql-tag'

const editProfile = gql`
  mutation editProfile($data: EditProfileData!) {
    editProfile(data: $data) {
      success
      message
      data
    }
  }
`

export default editProfile