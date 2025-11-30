import { gql } from '@apollo/client'

export const GET_DISCOUNTS = gql`
    query GetDiscounts($limit: Int, $offset: Int, $search: String, $productId: String) {
        getDiscounts(limit: $limit, offset: $offset, search: $search, productId: $productId) {
            success
            message
            discounts {
                id
                product_id
                type
                value
                starts_at
                ends_at
                product_name
                psku
                product_price
                currency
            }
            total
            limit
            offset
        }
    }
`

export const GET_DISCOUNT = gql`
    query GetDiscount($id: ID!) {
        getDiscount(id: $id) {
            success
            message
            discount {
                id
                product_id
                type
                value
                starts_at
                ends_at
                product_name
                psku
                product_price
                currency
            }
        }
    }
`

export const CREATE_DISCOUNT = gql`
    mutation CreateDiscount($input: DiscountInput!) {
        createDiscount(input: $input) {
            success
            message
            discount {
                id
                product_id
                type
                value
                starts_at
                ends_at
                product_name
                psku
                product_price
                currency
            }
        }
    }
`

export const UPDATE_DISCOUNT = gql`
    mutation UpdateDiscount($id: String!, $input: DiscountUpdateInput!) {
        updateDiscount(id: $id, input: $input) {
            success
            message
            discount {
                id
                product_id
                type
                value
                starts_at
                ends_at
                product_name
                psku
                product_price
                currency
            }
        }
    }
`

export const DELETE_DISCOUNT = gql`
    mutation DeleteDiscount($id: String!) {
        deleteDiscount(id: $id) {
            success
            message
        }
    }
`

export const GET_PRODUCTS_FOR_DISCOUNT = gql`
    query GetProductsForDiscount($limit: Int, $offset: Int, $search: String) {
        getProducts(limit: $limit, offset: $offset, search: $search) {
            success
            message
            products {
                id
                psku
                name
                price
                currency
                is_public
                discount {
                    id
                    product_id
                    type
                    value
                    starts_at
                    ends_at
                }
            }
            total
        }
    }
`
