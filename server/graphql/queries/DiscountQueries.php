<?php

use GraphQL\Type\Definition\Type;

return [
    'getDiscount' => [
        'type' => $DiscountResponseType,
        'args' => [
            'id' => Type::nonNull(Type::id())
        ],
        'resolve' => fn($root, $args, $context) => getDiscount($context['db'], $args['id'])
    ],

    'getDiscounts' => [
        'type' => $DiscountsResponseType,
        'args' => [
            'limit' => Type::int(),
            'offset' => Type::int(),
            'search' => Type::string(),
            'productId' => Type::string()
        ],
        'resolve' => fn($root, $args, $context) => getAllDiscounts($context['db'], $args)
    ],
];
