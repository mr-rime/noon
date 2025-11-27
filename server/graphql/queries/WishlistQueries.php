<?php

use GraphQL\Type\Definition\Type;

return [
    'getWishlistItems' => [
        'type' => $WishlistItemsResponse,
        'args' => [
            'wishlist_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => getWishlistItems($context['db'], $args['wishlist_id'])
    ],
    'getWishlists' => [
        'type' => $WishlistsResponse,
        'args' => [],
        'resolve' => fn($root, $args, $context) => getWishlists($context['db'])
    ],
    'getPublicWishlist' => [
        'type' => $PublicWishlistResponse,
        'args' => [
            'wishlist_id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => getPublicWishlist($context['db'], $args['wishlist_id'])
    ]
];
