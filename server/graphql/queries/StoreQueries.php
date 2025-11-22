<?php

use GraphQL\Type\Definition\Type;

return [
    'stores' => [
        'type' => Type::listOf($StoreType),
        'args' => [],
        'resolve' => fn($root, $args, $context) => getStores($context['db'])
    ],
    'store' => [
        'type' => $StoreType,
        'args' => ['id' => Type::nonNull(Type::int())],
        'resolve' => fn($root, $args, $context) => getStore($context['db'], $args['id'])
    ],
];
