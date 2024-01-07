import gql from 'graphql-tag'

const deleteMaterial = gql`
  mutation deleteMaterial($id: Float!) {
    deleteMaterial(id: $id) {
      success
      message
    }
  }
`

export default deleteMaterial