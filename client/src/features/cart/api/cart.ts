import { gql } from '@apollo/client'

export const ADD_CART_ITEM = gql`
    mutation ($product_id: String!, $quantity: Int!) {
        addToCart(product_id: $product_id, quantity: $quantity) {
            success
            message
            cartItems {
                product_id
                quantity
                name
            }
        }
    }
`

export const GET_CART_ITEMS = gql`
    query {
    getCartItems {
        success
        message
        cartItems {
            product_id
            name
            quantity
            images {
                id
                image_url
            }
            currency
            stock
            price
            discount_percentage
            final_price
        }
    }
    }
`

export const REMOVE_CART_ITEM = gql`
    mutation ($product_id: String!) {
        removeFromCart(product_id: $product_id) {
            success
            message
        }
    }
`

export const UPDATE_CART_ITEM_QUANTITY = gql`
    mutation ($product_id: String!, $quantity: Int!) {
        updateCartItemQuantity(product_id: $product_id, quantity: $quantity) {
            success
            message
            cartItems {
                product_id
                quantity
            }
        }
    }
`
