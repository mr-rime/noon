<?php

use GraphQL\Type\Definition\Type;

return [
    'getProductReviews' => [
        'type' => ReviewTypes::reviewsResponse(),
        'args' => [
            'productId' => Type::nonNull(Type::string()),
            'limit' => Type::int(),
            'offset' => Type::int()
        ],
        'resolve' => function ($root, $args, $context) {
            return getProductReviews($context['db'], array_merge($args, ['user_id' => $context['user_id'] ?? null]), $context);
        }
    ],

    'getUserReview' => [
        'type' => ReviewTypes::reviewResponse(),
        'args' => [
            'productId' => Type::nonNull(Type::string()),
            'orderId' => Type::string()
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => getUserReview($context['db'], array_merge($args, ['user_id' => $context['user_id']])))
    ],
];
