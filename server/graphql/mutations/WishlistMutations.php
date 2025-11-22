<?php

use GraphQL\Type\Definition\Type;

return [
    'createWishlist' => [
        'type' => $WishlistResponse,
        'args' => [
            'name' => Type::nonNull(Type::string()),
        ],
        'resolve' => fn($root, $args, $context) => createWishlist($context['db'], $args['name'])
    ],
    'addWishlistItem' => [
        'type' => $WishlistResponse,
        'args' => [
            'product_id' => Type::nonNull(Type::string()),
            'wishlist_id' => Type::string(),
        ],
        'resolve' => fn($root, $args, $context) => addItemToWishlist($context['db'], $args)
    ],
    'updateWishlist' => [
        'type' => $WishlistResponse,
        'args' => [
            'name' => Type::nonNull(Type::string()),
            'is_private' => Type::nonNull(Type::boolean()),
            'is_default' => Type::nonNull(Type::boolean()),
            'wishlist_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => updateWishlist($context['db'], $args)
    ],
    'removeWishlistItem' => [
        'type' => $WishlistResponse,
        'args' => [
            'wishlist_id' => Type::nonNull(Type::string()),
            'product_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => removeItemFromWishlist($context['db'], $args)
    ],
    'clearWishlist' => [
        'type' => $WishlistResponse,
        'args' => [
            'wishlist_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => clearWishlist($context['db'], $args['wishlist_id'])
    ],
    'deleteWishlist' => [
        'type' => $WishlistResponse,
        'args' => [
            'wishlist_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => deleteWishlist($context['db'], $args['wishlist_id'])
    ],
];
