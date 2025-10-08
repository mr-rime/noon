import { gql } from '@apollo/client'

export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($productId: String!, $limit: Int) {
    getRelatedProducts(productId: $productId, limit: $limit) {
      success
      message
      products {
        id
        psku
        name
        price
        final_price
        currency
        stock
        discount_percentage
        product_overview
        images {
          id
          image_url
          is_primary
        }
        productSpecifications {
          id
          spec_name
          spec_value
        }
        productAttributes {
          id
          attribute_name
          attribute_value
        }
        category_name
        subcategory_name
        brand_name
        group_name
        created_at
        updated_at
      }
    }
  }
`
