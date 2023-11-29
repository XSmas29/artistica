import gql from 'graphql-tag'

const categories = gql`
  query categories {
    categories {
      id
      name
    }
  }
`

export default categories