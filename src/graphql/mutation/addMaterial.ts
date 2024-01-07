import gql from 'graphql-tag'

const addMaterial = gql`
  mutation addMaterial($data: MaterialData!) {
    addMaterial(data: $data) {
      success
      message
    }
  }
`

export default addMaterial