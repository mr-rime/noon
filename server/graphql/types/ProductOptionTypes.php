<?php
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$ProductOptionType = new ObjectType([
    'name' => 'ProductOption',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'name' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::string()),
        'image_url' => Type::string(),
        'linked_product_id' => Type::string(),
        'type' => Type::nonNull(Type::string()),
    ],
]);

$ProductOptionInputType = new InputObjectType([
    'name' => 'ProductOptionInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::string()),
        'image_url' => Type::string(),
        'linked_product_id' => Type::string(),
        'type' => Type::nonNull(Type::string()),
    ],
]);


$ProductOptionGroupInput = new InputObjectType([
    'name' => 'ProductOptionGroupInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'values' => Type::nonNull(Type::listOf(Type::string())),
        'type' => Type::string(),
    ]
]);