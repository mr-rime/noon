import { gql } from '@apollo/client'

export const CREATE_CHECKOUT_SESSION = gql`
    mutation CreateCheckoutSession($success_url: String, $cancel_url: String) {
        createCheckoutSession(success_url: $success_url, cancel_url: $cancel_url) {
            success
            message
            session_url
            session_id
        }
    }
`

export const GET_USER_ORDERS = gql`
    query GetUserOrders($limit: Int, $offset: Int) {
        getUserOrders(limit: $limit, offset: $offset) {
            success
            message
            orders {
                id
                user_id
                total_amount
                currency
                status
                shipping_address
                payment_method
                payment_status
                created_at
                updated_at
                items {
                    id
                    product_id
                    order_id
                    quantity
                    price
                    currency
                    created_at
                }
            }
        }
    }
`

export const GET_ORDER_DETAILS = gql`
    query GetOrderDetails($order_id: String!) {
        getOrderDetails(order_id: $order_id) {
            success
            message
            order {
                id
                user_id
                total_amount
                currency
                status
                shipping_address
                payment_method
                payment_status
                created_at
                updated_at
                items {
                    id
                    product_id
                    order_id
                    quantity
                    price
                    currency
                    created_at
                    product_name
                    product_description
                    product_image
                }
                tracking {
                    id
                    order_id
                    shipping_provider
                    tracking_number
                    status
                    estimated_delivery_date
                    created_at
                    updated_at
                }
            }
        }
    }
`

export const GET_ORDER_TRACKING = gql`
    query GetOrderTracking($order_id: String!) {
        getOrderTracking(order_id: $order_id) {
            success
            message
            tracking {
                id
                order_id
                shipping_provider
                tracking_number
                status
                estimated_delivery_date
                created_at
                updated_at
                timeline {
                    status
                    description
                    completed
                    date
                    estimated_delivery_date
                }
            }
        }
    }
`

export const GET_ALL_ORDERS = gql`
    query GetAllOrders($limit: Int, $offset: Int, $status: String, $payment_status: String) {
        getAllOrders(limit: $limit, offset: $offset, status: $status, payment_status: $payment_status) {
            success
            message
            orders {
                id
                user_id
                total_amount
                currency
                status
                shipping_address
                payment_method
                payment_status
                created_at
                updated_at
                items {
                    id
                    product_id
                    order_id
                    quantity
                    price
                    currency
                    created_at
                }
                tracking {
                    id
                    order_id
                    shipping_provider
                    tracking_number
                    status
                    estimated_delivery_date
                    created_at
                    updated_at
                }
            }
        }
    }
`

export const UPDATE_ORDER_STATUS = gql`
    mutation UpdateOrderStatus($order_id: String!, $status: String, $payment_status: String) {
        updateOrderStatus(order_id: $order_id, status: $status, payment_status: $payment_status) {
            success
            message
        }
    }
`

export const UPDATE_TRACKING_DETAILS = gql`
    mutation UpdateTrackingDetails(
        $order_id: String!
        $shipping_provider: String
        $tracking_number: String
        $status: String
        $estimated_delivery_date: String
    ) {
        updateTrackingDetails(
            order_id: $order_id
            shipping_provider: $shipping_provider
            tracking_number: $tracking_number
            status: $status
            estimated_delivery_date: $estimated_delivery_date
        ) {
            success
            message
        }
    }
`
