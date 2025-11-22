<?php

use GraphQL\Type\Definition\Type;

return [
    'createStore' => [
        'type' => $StoreType,
        'args' => ['input' => Type::nonNull($StoreInputType)],
        'resolve' => fn($root, $args, $context) => createStore($context['db'], $args['input'])
    ],
    'updateStore' => [
        'type' => $StoreType,
        'args' => ['input' => Type::nonNull($StoreUpdateInputType)],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateStore($context['db'], $args['input']))
    ],
    'deleteStore' => [
        'type' => Type::nonNull(Type::boolean()),
        'args' => ['id' => Type::nonNull(Type::int())],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteStore($context['db'], $args['id']))
    ],
    'loginStore' => [
        'type' => $StoreAuthResponseType,
        'args' => [
            'email' => Type::nonNull(Type::string()),
            'password' => Type::nonNull(Type::string()),
        ],
        'resolve' => fn($root, $args, $context) => loginStore($context['db'], $args)
    ],
    'registerStore' => [
        'type' => $StoreAuthResponseType,
        'args' => [
            'name' => Type::nonNull(Type::string()),
            'email' => Type::nonNull(Type::string()),
            'password' => Type::nonNull(Type::string()),
            'number' => Type::string(),
            'thumbnail_url' => Type::string(),
        ],
        'resolve' => fn($root, $args, $context) => registerStore($context['db'], $args)
    ],
    'logoutStore' => [
        'type' => $StoreAuthResponseType,
        'resolve' => fn($root, $args, $context) => logoutStore()
    ],
];
