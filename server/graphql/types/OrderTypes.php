<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$OrderItemType = new ObjectType([
    'name' => 'OrderItem',
    'fields' => [
        'id' => Type::nonNull(Type::string()),
        'product_id' => Type::nonNull(Type::string()),
        'order_id' => Type::nonNull(Type::string()),
        'quantity' => Type::nonNull(Type::int()),
        'price' => Type::nonNull(Type::float()),
        'currency' => Type::nonNull(Type::string()),
        'created_at' => Type::string(),
        'product_name' => Type::string(),
        'product_description' => Type::string(),
        'product_image' => Type::string(),
    ]
]);

$TrackingType = new ObjectType([
    'name' => 'TrackingDetail',
    'fields' => [
        'id' => Type::nonNull(Type::string()),
        'order_id' => Type::nonNull(Type::string()),
        'shipping_provider' => Type::nonNull(Type::string()),
        'tracking_number' => Type::nonNull(Type::string()),
        'status' => Type::string(),
        'estimated_delivery_date' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$OrderType = new ObjectType([
    'name' => 'Order',
    'fields' => [
        'id' => Type::nonNull(Type::string()),
        'user_id' => Type::int(),
        'total_amount' => Type::nonNull(Type::float()),
        'currency' => Type::nonNull(Type::string()),
        'status' => Type::string(),
        'shipping_address' => Type::string(),
        'payment_method' => Type::string(),
        'payment_status' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
        'items' => Type::listOf($OrderItemType),
        'tracking' => $TrackingType,
    ]
]);

$OrderItemInputType = new InputObjectType([
    'name' => 'OrderItemInput',
    'fields' => [
        'product_id' => Type::nonNull(Type::string()),
        'quantity' => Type::nonNull(Type::int()),
        'price' => Type::nonNull(Type::float()),
        'currency' => Type::nonNull(Type::string()),
    ]
]);

$OrderResponseType = new ObjectType([
    'name' => 'OrderResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'order' => $OrderType
    ]
]);

$CheckoutSessionResponseType = new ObjectType([
    'name' => 'CheckoutSessionResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'session_url' => Type::string(),
        'session_id' => Type::string()
    ]
]);

$OrdersListResponseType = new ObjectType([
    'name' => 'OrdersListResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'orders' => Type::listOf($OrderType)
    ]
]);

$TrackingTimelineType = new ObjectType([
    'name' => 'TrackingTimelineItem',
    'fields' => [
        'status' => Type::nonNull(Type::string()),
        'description' => Type::nonNull(Type::string()),
        'completed' => Type::nonNull(Type::boolean()),
        'date' => Type::string(),
        'estimated_delivery_date' => Type::string()
    ]
]);

$TrackingDetailsWithTimelineType = new ObjectType([
    'name' => 'TrackingDetailsWithTimeline',
    'fields' => [
        'id' => Type::nonNull(Type::string()),
        'order_id' => Type::nonNull(Type::string()),
        'shipping_provider' => Type::nonNull(Type::string()),
        'tracking_number' => Type::nonNull(Type::string()),
        'status' => Type::string(),
        'estimated_delivery_date' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
        'timeline' => Type::listOf($TrackingTimelineType)
    ]
]);

$TrackingResponseType = new ObjectType([
    'name' => 'TrackingResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'tracking' => $TrackingDetailsWithTimelineType
    ]
]);

$AdminOrdersListResponseType = new ObjectType([
    'name' => 'AdminOrdersListResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'orders' => Type::listOf($OrderType)
    ]
]);

$UpdateOrderStatusResponseType = new ObjectType([
    'name' => 'UpdateOrderStatusResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string()
    ]
]);

$UpdateTrackingResponseType = new ObjectType([
    'name' => 'UpdateTrackingResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string()
    ]
]);