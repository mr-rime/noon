<?php

use GraphQL\Type\Definition\Type;

return [
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
];
