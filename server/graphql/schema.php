<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/types/UserTypes.php';
require_once __DIR__ . '/types/PartnerTypes.php';
require_once __DIR__ . '/types/ProductTypes.php';
require_once __DIR__ . '/types/ProductOptionTypes.php';
require_once __DIR__ . '/types/ProductSpecificationTypes.php';
require_once __DIR__ . '/types/OrderTypes.php';
require_once __DIR__ . '/types/UploadTypes.php';
require_once __DIR__ . '/resolvers/UserResolver.php';
require_once __DIR__ . '/resolvers/PartnerResolver.php';
require_once __DIR__ . '/resolvers/AuthResolver.php';
require_once __DIR__ . '/resolvers/ProdcutResolver.php';
require_once __DIR__ . '/resolvers/OrderResolver.php';
require_once __DIR__ . '/resolvers/UploadResolver.php';

$QueryType = new ObjectType([
    'name' => 'query',
    'fields' => [
        'getUsers' => [
            'type' => $UsersResponseType,
            'resolve' => requireAuth(fn($root, $args, $context) => getUsers($context['db']))
        ],

        'getUser' => [
            'type' => $UserResponseType,
            'args' => [
                'hash' => Type::nonNull(Type::string())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => getUser($context['db'], $args['hash']))
        ],

        'getPartner' => [
            'type' => $PartnerResponseType,
            'args' => [
                'id' => Type::nonNull(Type::string())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => getPartner($context['db'], $args))
        ],

        'getProducts' => [
            'type' => $ProductsResponseType,
            'args' => [
                'limit' => Type::int(),
                'offset' => Type::int()
            ],
            'resolve' => fn($root, $args, $context) => getAllProducts($context['db'], $args)
        ],

        'product' => [
            'type' => $ProductResponseType,
            'args' => [
                'id' => Type::nonNull(Type::id())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => getProductById($context['db'], $args['id']))
        ]
    ]
]);


$MutationType = new ObjectType([
    'name' => 'mutation',
    'fields' => [
        'login' => [
            'type' => $UserResponseType,
            'args' => [
                'email' => Type::nonNull(Type::string()),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => fn($root, $args, $context) => login(array_merge($args, ['db' => $context['db']]))
        ],

        'register' => [
            'type' => $UserResponseType,
            'args' => [
                'first_name' => Type::nonNull(Type::string()),
                'last_name' => Type::string(),
                'password' => Type::nonNull(Type::string()),
                'email' => Type::nonNull(Type::string())
            ],
            'resolve' => fn($root, $args, $context) => register(array_merge($args, ['db' => $context['db']]))
        ],

        'logout' => [
            'type' => $UserResponseType,
            'resolve' => fn($root, $args, $context) => logout()
        ],

        'createPartner' => [
            'type' => $PartnerResponseType,
            'args' => [
                'business_email' => Type::nonNull(Type::string()),
                'store_name' => Type::nonNull(Type::string()),
                'business_phone' => Type::string(),
                'password' => Type::nonNull(Type::string()),
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => createPartner($context['db'], $args))
        ],

        'loginPartner' => [
            'type' => $PartnerResponseType,
            'args' => [
                'business_email' => Type::nonNull(Type::string()),
                'password' => Type::nonNull(Type::string())
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => loginPartner($context['db'], $args))
        ],

        'createProduct' => [
            'type' => $ProductResponseType,
            'args' => [
                'name' => Type::nonNull(Type::string()),
                'price' => Type::nonNull(Type::float()),
                'category_id' => Type::string(),
                'currency' => Type::string(),
                'product_overview' => Type::string(),
                'images' => Type::listOf($ProductImageInputType),
                'productOptions' => Type::listOf($ProductOptionInputType),
                'productSpecifications' => Type::listOf($ProductSpecInputType),
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => createProduct($context['db'], $args))
        ],

        'createOrder' => [
            'type' => $OrderResponseType,
            'args' => [
                'currency' => Type::nonNull(Type::string()),
                'shipping_address' => Type::string(),
                'payment_method' => Type::string(),
                'items' => Type::listOf($OrderItemInputType),
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => createOrder($context['db'], $args))
        ],

        'uploadImage' => [
            'type' => $UploadResponseType,
            'args' => [
                'file' => Type::nonNull($UploadScalar),
            ],
            'resolve' => requireAuth(fn($root, $args, $context) => uploadImageResolver($args))
        ]
    ]
]);

return new Schema([
    'query' => $QueryType,
    'mutation' => $MutationType
]);