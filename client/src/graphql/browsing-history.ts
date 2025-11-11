import { gql } from "@apollo/client";


export const GET_RECENT_BROWSING_HISTORY = gql`

query {
    getRecentBrowsingHistory(limit: 5) {
        success
        message
    products {
            id
            name
            price
        }
    }
}

`

export const LOG_PRODUCT_VIEW = gql`
    mutation LogProductView($productId: String!) {
        logProductView(productId: $productId ) {
        success
        message
        }
    }
`

export const CLEAR_BROWSING_HISTORY = gql`
    mutation {
        clearBrowsingHistory {
        success
        message
    }
}


` 