<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

require_once __DIR__ . '/ProductTypes.php';

$HomeType = new ObjectType([
    'name' => 'Home',
    'fields' => [
        'recommendedForYou' => Type::listOf($ProductType),
    ]
]);

$HomeResponseType = new ObjectType([
    'name' => 'HomeResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'home' => $HomeType,
    ]
]);
