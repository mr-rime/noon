<?php

use GraphQL\Type\Definition\Type;

return [
    'createProduct' => [
        'type' => $ProductResponseType,
        'args' => [
            'name' => Type::nonNull(Type::string()),
            'price' => Type::nonNull(Type::float()),
            'currency' => Type::nonNull(Type::string()),
            'psku' => Type::string(),
            'category_id' => Type::string(),
            'subcategory_id' => Type::string(),
            'brand_id' => Type::int(),
            'group_id' => Type::string(),
            'stock' => Type::int(),
            'is_returnable' => Type::boolean(),
            'is_public' => Type::boolean(),
            'product_overview' => Type::string(),
            'discount' => $DiscountInputType,
            'images' => Type::listOf($ProductImageInputType),
            'productSpecifications' => Type::listOf($ProductSpecInputType),
            'productAttributes' => Type::listOf($ProductAttributeInputType),
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createProduct($context['db'], $args))
    ],
    'updateProduct' => [
        'type' => $ProductResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string()),
            'name' => Type::string(),
            'price' => Type::float(),
            'currency' => Type::string(),
            'psku' => Type::string(),
            'category_id' => Type::string(),
            'subcategory_id' => Type::string(),
            'brand_id' => Type::int(),
            'group_id' => Type::string(),
            'stock' => Type::int(),
            'is_returnable' => Type::boolean(),
            'is_public' => Type::boolean(),
            'product_overview' => Type::string(),
            'discount' => $DiscountInputType,
            'images' => Type::listOf($ProductImageInputType),
            'productSpecifications' => Type::listOf($ProductSpecInputType),
            'productAttributes' => Type::listOf($ProductAttributeInputType),
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateProduct($context["db"], $args))
    ],
    'createProductGroup' => [
        'type' => $ProductGroupResponseType,
        'args' => ['input' => Type::nonNull($ProductGroupInputType)],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createProductGroup($context['db'], $args['input']))
    ],
    'updateProductGroup' => [
        'type' => $ProductGroupResponseType,
        'args' => [
            'groupId' => Type::nonNull(Type::string()),
            'name' => Type::string(),
            'description' => Type::string(),
            'attributes' => Type::listOf(Type::string())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateProductGroup($context['db'], $args))
    ],
    'deleteProductGroup' => [
        'type' => $ProductGroupResponseType,
        'args' => ['groupId' => Type::nonNull(Type::string())],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteProductGroup($context['db'], $args['groupId']))
    ],
    'addProductToGroup' => [
        'type' => $ProductResponseType,
        'args' => [
            'product_id' => Type::nonNull(Type::string()),
            'group_id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => addProductToGroup($context['db'], $args['product_id'], $args['group_id']))
    ],
    'deleteProduct' => [
        'type' => $DeleteProductResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteProduct($context['db'], $args['id']))
    ],
];
