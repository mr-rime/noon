<?php

use GraphQL\Type\Definition\Type;

return [
    'createBanner' => [
        'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
        'args' => [
            'name' => Type::nonNull(Type::string()),
            'placement' => Type::nonNull(Type::string()),
            'description' => Type::string(),
            'targetUrl' => Type::string(),
            'imageUrl' => Type::string(),
            'startDate' => Type::nonNull(Type::string()),
            'endDate' => Type::nonNull(Type::string()),
            'isActive' => Type::boolean()
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createBanner($context['db'], $args))
    ],

    'updateBanner' => [
        'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
        'args' => [
            'id' => Type::nonNull(Type::string()),
            'name' => Type::nonNull(Type::string()),
            'placement' => Type::nonNull(Type::string()),
            'description' => Type::string(),
            'targetUrl' => Type::string(),
            'imageUrl' => Type::string(),
            'startDate' => Type::nonNull(Type::string()),
            'endDate' => Type::nonNull(Type::string()),
            'isActive' => Type::boolean()
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateBanner($context['db'], $args))
    ],

    'deleteBanner' => [
        'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
        'args' => [
            'id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteBanner($context['db'], $args))
    ],

    'toggleBannerStatus' => [
        'type' => \App\GraphQL\Types\BannerTypes::bannerResponse(),
        'args' => [
            'id' => Type::nonNull(Type::string())
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => toggleBannerStatus($context['db'], $args))
    ],
];
