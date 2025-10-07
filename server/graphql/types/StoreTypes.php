<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

require_once __DIR__ . '/ProductTypes.php';

$StoreType = new ObjectType([
    'name' => 'Store',
    'fields' => [
        'id' => Type::int(),
        'name' => Type::string(),
        'number' => Type::string(),
        'email' => Type::string(),
        'thumbnail_url' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
        'products' => Type::listOf($ProductType),
    ]
]);

$StoreInputType = new InputObjectType([
    'name' => 'StoreInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'number' => Type::string(),
        'email' => Type::nonNull(Type::string()),
        'password' => Type::nonNull(Type::string()),
        'thumbnail_url' => Type::string(),
    ]
]);

$StoreUpdateInputType = new InputObjectType([
    'name' => 'StoreUpdateInput',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'name' => Type::string(),
        'number' => Type::string(),
        'email' => Type::string(),
        'password' => Type::string(),
        'thumbnail_url' => Type::string(),
    ]
]);

$StoreAuthResponseType = new ObjectType([
    'name' => 'StoreAuthResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::nonNull(Type::string()),
        'store' => $StoreType,
    ]
]);


