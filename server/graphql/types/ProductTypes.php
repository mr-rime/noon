<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

require_once __DIR__ . '/ProductOptionTypes.php';
require_once __DIR__ . '/ProductSpecificationTypes.php';


$ProductImageType = new ObjectType([
    'name' => 'ProductImage',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'image_url' => Type::nonNull(Type::string()),
        'is_primary' => Type::boolean()
    ]
]);

$ProductImageInputType = new InputObjectType([
    'name' => 'ProductImageInput',
    'fields' => [
        'image_url' => Type::nonNull(Type::string()),
        'is_primary' => Type::boolean(),
    ],
]);




$ProductSpecInputType = new InputObjectType([
    'name' => 'ProductSpecificationInput',
    'fields' => [
        'spec_name' => Type::nonNull(Type::string()),
        'spec_value' => Type::nonNull(Type::string()),
    ]
]);

$ProductType = new ObjectType([
    'name' => 'Product',
    'fields' => [
        'id' => Type::nonNull(Type::string()),
        'name' => Type::nonNull(Type::string()),
        'price' => Type::nonNull(Type::float()),
        'category_id' => Type::string(),
        'currency' => Type::string(),
        'product_overview' => Type::string(),
        'images' => Type::listOf($ProductImageType),
        'productOptions' => Type::listOf($ProductOptionType),
        'productSpecifications' => Type::listOf($ProductSpecificationType),
        'created_at' => Type::string(),
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