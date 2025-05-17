<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$OrderType = new ObjectType([
    'name' => 'Order',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'user_id' => Type::nonNull(Type::int()),
        'total_amount' => Type::nonNull(Type::float()),
        'currency' => Type::nonNull(Type::string()),
        'status' => Type::nonNull(Type::string()),
        'shipping_address' => Type::string(),
        'payment_method' => Type::string(),
        'payment_status' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
        'items' => Type::listOf($OrderItemType),
        'tracking' => $TrackingType,
    ]
]);

$OrderItemType = new ObjectType([
    'name' => 'OrderItem',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'product_id' => Type::nonNull(Type::string()),
        'order_id' => Type::nonNull(Type::int()),
        'quantity' => Type::nonNull(Type::int()),
        'price' => Type::nonNull(Type::float()),
        'currency' => Type::nonNull(Type::string()),
        'created_at' => Type::string(),
    ]
]);


$TrackingType = new ObjectType([
    'name' => 'TrackingDetail',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'order_id' => Type::nonNull(Type::int()),
        'shipping_provider' => Type::nonNull(Type::string()),
        'tracking_number' => Type::nonNull(Type::string()),
        'status' => Type::string(),
        'estimated_delivery_date' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
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