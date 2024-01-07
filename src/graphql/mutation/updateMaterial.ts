import gql from 'graphql-tag'

const editMaterial = gql`
  mutation editMaterial($id: Float!, $data: MaterialData!) {
    editMaterial(id: $id, data: $data) {
      success
      message
    }
  }
`

export default editMaterial