import gql from 'graphql-tag'

const categories = gql`
  query categories($filter: filterCategories, $pagination: pagination) {
    categories(filter: $filter, pagination: $pagination) {
      count
      categories {
        id
        name
      }
    }
  }
`

export default categories