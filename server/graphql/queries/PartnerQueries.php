<?php

use GraphQL\Type\Definition\Type;

return [
    'getPartner' => [
        'type' => $PartnerResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => getPartner($context['db'], $args))
    ],
];
