import gql from 'graphql-tag'

const updateMaterial = gql`
  mutation updateMaterial($id: Float!, $data: MaterialData!) {
    updateMaterial(id: $id, data: $data) {
      success
      message
    }
  }
`

export default updateMaterial