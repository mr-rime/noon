<?php

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

require_once __DIR__ . '/ProductTypes.php';
require_once __DIR__ . '/ProductTypes.php';


$BrowsingHistoryType = new ObjectType([
    'name' => 'BrowsingHistory',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'session_id' => Type::nonNull(Type::string()),
        'user_id' => Type::int(),
        'product_id' => Type::nonNull(Type::string()),
        'viewed_at' => Type::nonNull(Type::string()),
        'product' => $ProductType
    ]
]);


$BrowsingHistoryResponseType = new ObjectType([
    'name' => 'BrowsingHistoryResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
    ]
]);

$BrowsingHistoryListResponseType = new ObjectType([
    'name' => 'BrowsingHistoryListResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'products' => Type::listOf($ProductType),
    ]
]);
