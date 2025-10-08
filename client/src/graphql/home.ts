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
        is_in_wishlist
        wishlist_id
        images {
          id
          image_url
          is_primary
        }
        discount_percentage
       
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
