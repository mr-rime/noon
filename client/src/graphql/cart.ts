import { gql } from "@apollo/client";

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
`;

export const GET_CART_ITEMS = gql`
    query {
    getCartItems {
        success
        message
        cartItems {
            name
            quantity
            images {
                id
            }
            price
            discount_percentage
            final_price
        }
    }
    }
`;
