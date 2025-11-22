<?php

use GraphQL\Type\Definition\Type;

return [
    'createDiscount' => [
        'type' => $DiscountResponseType,
        'args' => [
            'input' => Type::nonNull($DiscountInputType)
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createDiscount($context['db'], $args['input']))
    ],

    'updateDiscount' => [
        'type' => $DiscountResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string()),
            'input' => Type::nonNull($DiscountUpdateInputType)
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateDiscount($context['db'], array_merge(['id' => $args['id']], $args['input'])))
    ],

    'deleteDiscount' => [
        'type' => $DeleteDiscountResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteDiscount($context['db'], $args))
    ],
];
