<?php

use GraphQL\Type\Definition\Type;

return [
    'createProductReview' => [
        'type' => ReviewTypes::reviewResponse(),
        'args' => [
            'product_id' => Type::nonNull(Type::string()),
            'rating' => Type::nonNull(Type::int()),
            'title' => Type::string(),
            'comment' => Type::string(),
            'verified_purchase' => Type::boolean(),
            'order_id' => Type::string()
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => createProductReview($context['db'], array_merge($args, ['user_id' => $context['user_id']])))
    ],

    'updateProductReview' => [
        'type' => ReviewTypes::reviewResponse(),
        'args' => [
            'id' => Type::nonNull(Type::int()),
            'rating' => Type::int(),
            'title' => Type::string(),
            'comment' => Type::string()
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => updateProductReview($context['db'], array_merge($args, ['user_id' => $context['user_id']])))
    ],

    'deleteProductReview' => [
        'type' => ReviewTypes::reviewResponse(),
        'args' => [
            'id' => Type::nonNull(Type::int())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => deleteProductReview($context['db'], array_merge($args, ['user_id' => $context['user_id']])))
    ],

    'voteReviewHelpful' => [
        'type' => ReviewTypes::reviewVoteResponse(),
        'args' => [
            'reviewId' => Type::nonNull(Type::int())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => voteReviewHelpful($context['db'], array_merge($args, ['user_id' => $context['user_id']])))
    ],

    'removeReviewVote' => [
        'type' => ReviewTypes::reviewVoteResponse(),
        'args' => [
            'reviewId' => Type::nonNull(Type::int())
        ],
        'resolve' => requireAuth(fn($root, $args, $context) => removeReviewVote($context['db'], array_merge($args, ['user_id' => $context['user_id']])))
    ],
];
