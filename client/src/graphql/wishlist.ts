import { gql } from '@apollo/client'

export const GET_WISHLIST_ITEMS = gql`
    query ($wishlist_id: String!) {
    getWishlistItems(wishlist_id: $wishlist_id) {
        success
        message
        data {
            id
            name
            images {
                id
                image_url
            }
            price
            final_price
            discount_percentage
        }
    }
    }
`

export const CREATE_WISHLIST = gql`
    mutation($name: String!) {
        createWishlist(name: $name) {
            success
            message
        }
    }
`
export const ADD_WISHLIST_ITEM = gql`
    mutation ($product_id: String!) {
        addWishlistItem(product_id: $product_id) {
            success
            message
        }
    }
`

export const GET_WISHLISTS = gql`
query {
    getWishlists {
        success
        message
        data {
            id
            name
            is_private
            is_default
            item_count
        }
    }
    }

`

export const UPDATE_WISHLIST = gql`
    mutation (
        $name: String!
        $is_private: Boolean!
        $is_default: Boolean!
        $wishlist_id: String!
        ) {
            updateWishlist(
                name: $name
                is_private: $is_private
                is_default: $is_default
                wishlist_id: $wishlist_id
            ) {
                success
                message
        }
    }

`

export const REMOVE_WISHLIST_ITEM = gql`
    mutation ($wishlist_id: String!, $product_id: String!) {
        removeWishlistItem(product_id: $product_id, wishlist_id: $wishlist_id) {
            success
            message
        }
    }
`
