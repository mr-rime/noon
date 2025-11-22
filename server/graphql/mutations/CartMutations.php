<?php

use GraphQL\Type\Definition\Type;

return [
    'addToCart' => [
        'type' => $CartResponseType,
        'args' => [
            'product_id' => Type::nonNull(Type::string()),
            'quantity' => Type::nonNull(Type::int())
        ],
        'resolve' => fn($root, $args, $context) => addToCart($context['db'], $args)
    ],

    'removeFromCart' => [
        'type' => $CartResponseType,
        'args' => [
            'product_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => removeFromCart($context['db'], $args, $context)
    ],

    'updateCartItemQuantity' => [
        'type' => $CartResponseType,
        'args' => [
            'product_id' => Type::nonNull(Type::string()),
            'quantity' => Type::nonNull(Type::int()),
        ],
        'resolve' => fn($root, $args, $context) => updateCartItemQuantity($context['db'], $args)
    ],
];
