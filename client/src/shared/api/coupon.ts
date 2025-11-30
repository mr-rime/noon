import { gql } from "@apollo/client"

export const GET_COUPONS = gql`
    query GetCoupons($limit: Int, $offset: Int, $search: String) {
        getCoupons(limit: $limit, offset: $offset, search: $search) {
            success
            message
            coupons {
                id
                code
                type
                value
                starts_at
                ends_at
                usage_limit
                used_count
                status
                created_at
            }
            total
            limit
            offset
        }
    }
`

export const GET_COUPON = gql`
    query GetCoupon($id: ID!) {
        getCoupon(id: $id) {
            success
            message
            coupon {
                id
                code
                type
                value
                starts_at
                ends_at
                usage_limit
                used_count
                status
                created_at
            }
        }
    }
`

export const CREATE_COUPON = gql`
    mutation CreateCoupon($input: CouponInput!) {
        createCoupon(input: $input) {
            success
            message
            coupon {
                id
                code
                type
                value
                starts_at
                ends_at
                usage_limit
                used_count
                status
                created_at
            }
        }
    }
`

export const UPDATE_COUPON = gql`
    mutation UpdateCoupon($id: ID!, $input: CouponUpdateInput!) {
        updateCoupon(id: $id, input: $input) {
            success
            message
            coupon {
                id
                code
                type
                value
                starts_at
                ends_at
                usage_limit
                used_count
                status
                created_at
            }
        }
    }
`

export const DELETE_COUPON = gql`
    mutation DeleteCoupon($id: ID!) {
        deleteCoupon(id: $id) {
            success
            message
        }
    }
`

export const VALIDATE_COUPON = gql`
    query ValidateCoupon($code: String!) {
        validateCoupon(code: $code) {
            success
            message
            coupon {
                id
                code
                type
                value
                starts_at
                ends_at
                usage_limit
                used_count
                status
                created_at
            }
        }
    }
`
