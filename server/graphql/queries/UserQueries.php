<?php

use GraphQL\Type\Definition\Type;

return [
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
];
