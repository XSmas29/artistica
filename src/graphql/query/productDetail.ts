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
        attribute_values {
          id
          option {
            id
            name
          }
        }
      }
      images {
        id
        path
        variant {
          id
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