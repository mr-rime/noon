<?php

use GraphQL\Type\Definition\Type;

return [
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
        'resolve' => fn($root, $args, $context) => logout($context['db'])
    ],
];
