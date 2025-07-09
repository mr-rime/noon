<?php


use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$CartItemType = new ObjectType([
    'name' => 'CartItem',
    'fields' => [
        'product_id' => Type::nonNull(Type::string()),
        'name' => Type::string(),
        'quantity' => Type::nonNull(Type::int()),
        'currency' => Type::string(),
        'price' => Type::float(),
        'final_price' => Type::float(),
        'discount_percentage' => Type::float(),
        'images' => Type::listOf($ProductImageType),
        'stock' => Type::int(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$CartResponseType = new ObjectType([
    'name' => 'CartResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'cartItems' => Type::listOf($CartItemType),
    ]
]);
