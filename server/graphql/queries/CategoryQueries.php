<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

return [
    'getCategories' => [
        'type' => $CategoriesResponseType,
        'args' => [
            'search' => Type::string(),
            'parentId' => Type::string(),
            'includeChildren' => Type::boolean()
        ],
        'resolve' => fn($root, $args, $context) => getCategories(
            $context['db'],
            $args['parentId'] ?? null,
            $args['includeChildren'] ?? true,
            $args['search'] ?? ''
        )
    ],
    'getCategory' => [
        'type' => $CategoryResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string()),
            'includeChildren' => Type::boolean()
        ],
        'resolve' => fn($root, $args, $context) => getCategory(
            $context['db'],
            $args['id'],
            $args['includeChildren'] ?? false
        )
    ],
    'getCategoryBreadcrumb' => [
        'type' => new ObjectType([
            'name' => 'CategoryBreadcrumbResponse',
            'fields' => [
                'success' => Type::boolean(),
                'message' => Type::string(),
                'breadcrumb' => Type::listOf($CategoryBreadcrumbType)
            ]
        ]),
        'args' => [
            'categoryId' => Type::nonNull(Type::string())
        ],
        'resolve' => fn($root, $args, $context) => getCategoryBreadcrumb(
            $context['db'],
            $args['categoryId']
        )
    ],
    'getCategoryBySlug' => [
        'type' => $CategoryResponseType,
        'args' => [
            'slug' => Type::nonNull(Type::string()),
            'includeChildren' => Type::boolean()
        ],
        'resolve' => fn($root, $args, $context) => getCategoryBySlug(
            $context['db'],
            $args['slug'],
            $args['includeChildren'] ?? true
        )
    ],
    'getCategoryByNestedPath' => [
        'type' => $CategoryResponseType,
        'args' => [
            'path' => Type::nonNull(Type::string()),
            'includeChildren' => Type::boolean()
        ],
        'resolve' => fn($root, $args, $context) => getCategoryByNestedPath(
            $context['db'],
            $args['path'],
            $args['includeChildren'] ?? true
        )
    ],
    'getHierarchicalCategories' => [
        'type' => $CategoriesResponseType,
        'args' => [
            'rootCategoryId' => Type::string(),
            'maxDepth' => Type::int()
        ],
        'resolve' => fn($root, $args, $context) => getHierarchicalCategories($context['db'], $args)
    ],
    'getSubcategories' => [
        'type' => $SubcategoriesResponseType,
        'args' => ['category_id' => Type::string(), 'search' => Type::string()],
        'resolve' => fn($root, $args, $context) => getSubcategories($context['db'], $args['category_id'] ?? null, $args['search'] ?? '')
    ],
];
