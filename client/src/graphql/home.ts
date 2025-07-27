import { gql } from '@apollo/client'

export const GET_HOME = gql`
query ($limit: Int, $offset: Int, $search: String) {
  getHome(limit: $limit, offset: $offset, search: $search) {
    success
    message
    home {
      recommendedForYou {
        id
        name
        price
        final_price
        is_returnable
        category_id
        currency
        product_overview
        stock
        images {
          id
          image_url
          is_primary
        }
        discount_percentage
        productOptions {
          id
          name
          value
          image_url
          type
          linked_product_id          
        }
        productSpecifications {
          id
          spec_name
          spec_value
        }
        
      }
    }
  }
}

`
