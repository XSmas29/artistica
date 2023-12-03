import gql from 'graphql-tag'

const productDetail = gql`
  query productDetail($id: Float!) {
    productDetail(id: $id) {
      id
      name
      description
      slug
      single_variant
      images {
        id
        path
        variant {
          id
          name
        }
      }
      variants {
        id
        name
        price
        stock
      }
      category {
        id
        name
      }
      material {
        id
        name
      }
    }
  }
`

export default productDetail