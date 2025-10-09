<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$VariantOptionPairInput = new InputObjectType([
    'name' => 'VariantOptionPairInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::string()),
    ]
]);

$ProductVariantInputType = new InputObjectType([
    'name' => 'ProductVariantInput',
    'fields' => [
        'sku' => Type::nonNull(Type::string()),
        'options' => Type::nonNull(Type::listOf($VariantOptionPairInput)),
        'price' => Type::float(),
        'stock' => Type::int(),
        'image_url' => Type::string(),
    ]
]);

$ProductVariantType = new ObjectType([
    'name' => 'ProductVariant',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'product_id' => Type::nonNull(Type::string()),
        'sku' => Type::nonNull(Type::string()),
        'option_combination' => Type::nonNull(Type::string()),
        'price' => Type::float(),
        'stock' => Type::int(),
        'image_url' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
    ]
]);

$RelatedVariantType = new ObjectType([
    'name' => 'RelatedVariant',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'product_id' => Type::nonNull(Type::string()),
        'sku' => Type::nonNull(Type::string()),
        'option_combination' => Type::nonNull(Type::string()),
        'price' => Type::float(),
        'stock' => Type::int(),
        'image_url' => Type::string(),
        'product' => new ObjectType([
            'name' => 'RelatedVariantProduct',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::nonNull(Type::string()),
            ]
        ])
    ]
]);

$RelatedVariantsResponseType = new ObjectType([
    'name' => 'RelatedVariantsResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::nonNull(Type::string()),
        'variants' => Type::listOf($RelatedVariantType),
    ]
]);


