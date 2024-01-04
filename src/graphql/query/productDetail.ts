import gql from 'graphql-tag'

const productDetail = gql`
  query productDetail($id: Float!) {
    productDetail(id: $id) {
      id
      name
      description
      slug
      single_variant
      attributes {
        id
        name
        options {
          id
          name
        }
      }
      variants {
        id
        price
        stock
        sku
        image {
          id
          path
        }
        
        attribute_values {
          id
          attribute {
            id
            name
          }
          option {
            id
            name
          }
        }
      }
      images {
        id
        path
        
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