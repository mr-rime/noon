<?php

use GraphQL\Type\Definition\Type;

return [
    'getCartItems' => [
        'type' => $CartResponseType,
        'args' => [],
        'resolve' => fn($root, $args, $context) => getCart($context['db'])
    ],
];
