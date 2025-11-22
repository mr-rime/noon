<?php

use GraphQL\Type\Definition\Type;

return [
    'getHome' => [
        'type' => $HomeResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int(),
            'search' => Type::string()
        ],
        'resolve' => fn($root, $args, $context) => getHome($context['db'], $args)
    ],
];
