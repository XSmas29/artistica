import gql from 'graphql-tag'

const verifyUser = gql`
  mutation verifyUser($id: Float!, $data: VerifyData!) {
    verifyUser(id: $id, data: $data) {
      success
      message
      data
    }
  }
`

export default verifyUser