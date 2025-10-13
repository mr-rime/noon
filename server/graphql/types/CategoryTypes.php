<?php
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$CategoryType = new ObjectType([
    'name' => 'Category',
    'fields' => [
        'category_id' => Type::nonNull(Type::string()),
        'name' => Type::nonNull(Type::string()),
        'slug' => Type::string(),
        'description' => Type::string(),
        'level' => Type::int(),
        'path' => Type::string(),
        'display_order' => Type::int(),
        'image_url' => Type::string(),
        'icon_url' => Type::string(),
        'is_active' => Type::boolean(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
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
