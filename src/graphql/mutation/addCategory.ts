import gql from 'graphql-tag'

const addCategory = gql`
  mutation addCategory($data: CategoryData!) {
    addCategory(data: $data) {
      success
      message
    }
  }
`

export default addCategory