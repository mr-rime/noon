<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$ProductOptionType = new ObjectType([
    'name' => 'ProductOption',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'name' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::string()),
        'image_url' => Type::string(),
        'type' => Type::nonNull(Type::string()), // text or image
    ],
]);

$ProductOptionInputType = new InputObjectType([
    'name' => 'ProductOptionInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'value' => Type::nonNull(Type::string()),
        'image_url' => Type::string(),
        'type' => Type::nonNull(Type::string()),
    ],
]);