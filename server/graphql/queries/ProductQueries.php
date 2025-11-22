<?php

use GraphQL\Type\Definition\Type;

return [
    'getProducts' => [
        'type' => $ProductsResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int(),
            'search' => Type::string(),
            'categoryId' => Type::string(),
            'categories' => Type::listOf(Type::string()),
            'brands' => Type::listOf(Type::int()),
            'minPrice' => Type::float(),
            'maxPrice' => Type::float(),
            'minRating' => Type::float()
        ],
        'resolve' => fn($root, $args, $context) => getAllProducts($context['db'], $args)
    ],

    'getProduct' => [
        'type' => $ProductResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id())
        ],
        'resolve' => fn($root, $args, $context) => getProductById($context['db'], $args['id'])
    ],

    'getPublicProduct' => [
        'type' => $ProductResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id())
        ],
        'resolve' => fn($root, $args, $context) => getPublicProductById($context['db'], $args['id'])
    ],

    'getDashboardProducts' => [
        'type' => $ProductsResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int(),
            'search' => Type::string(),
            'categoryId' => Type::string(),
            'categories' => Type::listOf(Type::string()),
            'brands' => Type::listOf(Type::int()),
            'minPrice' => Type::float(),
            'maxPrice' => Type::float(),
            'minRating' => Type::float()
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => getAllProducts($context['db'], $args))
    ],
    'getDashboardProduct' => [
        'type' => $ProductResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => getProductById($context['db'], $args['id']))
    ],
    'getProductGroups' => [
        'type' => $ProductGroupsResponseType,
        'args' => ['category_id' => Type::string()],
        'resolve' => fn($root, $args, $context) => getProductGroups($context['db'], $args['category_id'] ?? null)
    ],
    'getProductByPsku' => [
        'type' => $ProductResponseType,
        'args' => ['psku' => Type::nonNull(Type::string())],
        'resolve' => fn($root, $args, $context) => getProductByPsku($context['db'], $args['psku'])
    ],
    'validatePsku' => [
        'type' => Type::boolean(),
        'args' => ['psku' => Type::nonNull(Type::string())],
        'resolve' => fn($root, $args, $context) => validatePskuUniqueness($context['db'], $args['psku'])
    ],
    'getRelatedProducts' => [
        'type' => $ProductsResponseType,
        'args' => [
            'productId' => Type::nonNull(Type::string()),
            'limit' => Type::int()
        ],
        'resolve' => fn($root, $args, $context) => getRelatedProducts($context['db'], $args['productId'], $args['limit'] ?? 8)
    ],
];
