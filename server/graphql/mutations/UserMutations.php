<?php

use GraphQL\Type\Definition\Type;

return [
    'updateUser' => [
        'type' => $UserResponseType,
        'args' => [
            'id' => Type::nonNull(Type::int()),
            'first_name' => Type::string(),
            'last_name' => Type::string(),
            'phone_number' => Type::string(),
            'birthday' => Type::string(),
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => updateUser($context['db'], $args))
    ],
];
