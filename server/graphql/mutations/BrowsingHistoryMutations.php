<?php

use GraphQL\Type\Definition\Type;

return [
    'logProductView' => [
        'type' => $BrowsingHistoryResponseType,
        'args' => [
            'productId' => Type::nonNull(Type::string())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => logProductView($context['db'], $args))
    ],

    'clearBrowsingHistory' => [
        'type' => $BrowsingHistoryResponseType,
        'resolve' => requireAuth(fn($root, $args, $context) => clearBrowsingHistory($context['db']))
    ],
];
