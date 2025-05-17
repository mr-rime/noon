<?php
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$CategoryType = new ObjectType([
    'name' => 'Category',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'name' => Type::nonNull(Type::string()),
    ]
]);

$CategoryResponseType = new ObjectType([
    'name' => 'CategoryResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'category' => $CategoryType,
    ]
]);

$CategoriesResponseType = new ObjectType([
    'name' => 'CategoriesResponse',
    'fields' => [
        'success' => Type::nonNull(Type::boolean()),
        'message' => Type::string(),
        'categories' => Type::listOf($CategoryType),
    ]
]);
