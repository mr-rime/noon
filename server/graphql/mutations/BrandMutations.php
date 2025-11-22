<?php

use GraphQL\Type\Definition\Type;

return [
    'createBrand' => [
        'type' => $BrandResponseType,
        'args' => ['input' => Type::nonNull($BrandInputType)],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createBrand($context['db'], $args['input']))
    ],
    'updateBrand' => [
        'type' => $BrandResponseType,
        'args' => [
            'id' => Type::nonNull(Type::int()),
            'input' => Type::nonNull($BrandInputType)
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateBrand($context['db'], $args['id'], $args['input']))
    ],
    'deleteBrand' => [
        'type' => $BrandResponseType,
        'args' => ['id' => Type::nonNull(Type::int())],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteBrand($context['db'], $args['id']))
    ],
];
