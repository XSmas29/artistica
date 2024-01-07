import gql from 'graphql-tag'

const materials = gql`
  query materials($filter: filterMaterials, $pagination: pagination) {
    materials(filter: $filter, pagination: $pagination) {
      count
      materials {
        id
        name
      }
    }
  }
`

export default materials