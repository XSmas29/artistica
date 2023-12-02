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
      }
      variants {
        id
        price
        images {
          id
          path
        }
      }
    }
  }
`

export default productDetail