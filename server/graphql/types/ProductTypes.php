<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

require_once __DIR__ . '/ProductSpecificationTypes.php';
require_once __DIR__ . '/DiscountTypes.php';
require_once __DIR__ . '/PskuTypes.php';


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

$ProductInputType = new InputObjectType([
    'name' => 'ProductInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'price' => Type::nonNull(Type::float()),
        'currency' => Type::nonNull(Type::string()),
        'psku' => Type::string(),
        'category_id' => Type::int(),
        'subcategory_id' => Type::int(),
        'brand_id' => Type::int(),
        'group_id' => Type::string(),
        'stock' => Type::int(),
        'is_returnable' => Type::boolean(),
        'product_overview' => Type::string(),
        'images' => Type::listOf($ProductImageInputType),
        'productSpecifications' => Type::listOf($ProductSpecInputType),
        'productAttributes' => Type::listOf($ProductAttributeInputType),
        'discount' => $DiscountInputType
    ]
]);

$ProductType = new ObjectType([
    'name' => 'Product',
    'fields' => function () use (&$ProductType, $ProductImageType, $ProductSpecificationType, $DiscountType, $CategoryType, $SubcategoryType, $BrandType, $ProductGroupType, $ProductAttributeType, $GroupAttributeType) {
        return [
            'id' => Type::nonNull(Type::string()),
            'psku' => Type::string(),
            'name' => Type::nonNull(Type::string()),
            'price' => Type::nonNull(Type::float()),
            'final_price' => Type::nonNull(Type::float()),
            'currency' => Type::string(),
            'stock' => Type::int(),
            'is_returnable' => Type::nonNull(Type::boolean()),
            'product_overview' => Type::string(),
            'user_id' => Type::int(),
            'store_id' => Type::int(),
            'category_id' => Type::int(),
            'subcategory_id' => Type::int(),
            'brand_id' => Type::int(),
            'group_id' => Type::string(),
            'category_name' => Type::string(),
            'subcategory_name' => Type::string(),
            'brand_name' => Type::string(),
            'group_name' => Type::string(),
            'discount' => $DiscountType,
            'discount_percentage' => Type::float(),
            'is_in_wishlist' => Type::boolean(),
            'wishlist_id' => Type::string(),
            'images' => Type::listOf($ProductImageType),
            'productSpecifications' => Type::listOf($ProductSpecificationType),
            'productAttributes' => Type::listOf($ProductAttributeType),
            'groupAttributes' => Type::listOf($GroupAttributeType),
            'groupProducts' => Type::listOf($ProductType), // Returns full Product objects
            'created_at' => Type::string(),
            'updated_at' => Type::string(),
        ];
    }
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
        'total' => Type::int(),
    ]
]);

$DeleteProductResponseType = new ObjectType([
    'name' => 'DeleteProductResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
    ]
]);