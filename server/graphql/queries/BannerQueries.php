<?php

use GraphQL\Type\Definition\Type;

return [
    'getBanners' => [
        'type' => \App\GraphQL\Types\BannerTypes::bannerList(),
        'args' => [
            'placement' => Type::string(),
            'isActive' => Type::boolean(),
            'limit' => Type::int(),
            'offset' => Type::int(),
            'search' => Type::string()
        ],
        'resolve' => fn($root, $args, $context) => getBanners($context['db'], $args)
    ],

    'getBanner' => [
        'type' => \App\GraphQL\Types\BannerTypes::banner(),
        'args' => [
            'id' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => getBanner($context['db'], $args)
    ],

    'getActiveBannersByPlacement' => [
        'type' => Type::listOf(\App\GraphQL\Types\BannerTypes::banner()),
        'args' => [
            'placement' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => getActiveBannersByPlacement($context['db'], $args)
    ],
];
