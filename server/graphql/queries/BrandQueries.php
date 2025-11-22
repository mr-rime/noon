<?php

use GraphQL\Type\Definition\Type;

return [
    'getBrands' => [
        'type' => $BrandsResponseType,
        'args' => ['search' => Type::string()],
        'resolve' => fn($root, $args, $context) => getBrands($context['db'], $args['search'] ?? '')
    ],
];
