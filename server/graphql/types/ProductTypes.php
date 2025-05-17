<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$ProductType = new ObjectType([
    'name' => 'Product',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'name' => Type::nonNull(Type::string()),
        'price' => Type::nonNull(Type::float()),
        'description' => Type::string(),
        'category_id' => Type::int(),
        'image' => Type::string(),
        'created_at' => Type::string()
    ]
]);

$ProductResponseType = new ObjectType([
    'name' => 'ProductResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'product' => $ProductType,
    ]
]);

$ProductsResponseType = new ObjectType([
    'name' => 'ProductsResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'products' => Type::listOf($ProductType),
    ]
]);