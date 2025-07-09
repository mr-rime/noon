import { gql } from "@apollo/client";

export const ADD_CART = gql`

mutation {
    addCart($productId: String!, $quantity: Int!) {
        success
        message
    }
}
`;
