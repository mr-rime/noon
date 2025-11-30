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
        rating
        review_count
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
      previouslyBrowsed {
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
        rating
        review_count
        images { id image_url is_primary }
        discount_percentage
      }
      bestDeals {
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
        rating
        review_count
        images { id image_url is_primary }
        discount_percentage
      }
      discountedProducts {
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
        rating
        review_count
        images { id image_url is_primary }
        discount_percentage
      }
    }
  }
}

`
