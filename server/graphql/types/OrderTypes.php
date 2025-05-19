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