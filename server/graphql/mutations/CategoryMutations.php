<?php

use GraphQL\Type\Definition\Type;

return [
    'createCategory' => [
        'type' => $CategoryResponseType,
        'args' => ['input' => Type::nonNull($CategoryInputType)],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createCategory($context['db'], $args['input']))
    ],
    'updateCategory' => [
        'type' => $CategoryResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string()),
            'input' => Type::nonNull($CategoryInputType)
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateCategory($context['db'], $args['id'], $args['input']))
    ],
    'deleteCategory' => [
        'type' => $CategoryResponseType,
        'args' => ['id' => Type::nonNull(Type::string())],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteCategory($context['db'], $args['id']))
    ],
    'createSubcategory' => [
        'type' => $SubcategoryResponseType,
        'args' => ['input' => Type::nonNull($SubcategoryInputType)],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => createSubcategory($context['db'], $args['input']))
    ],
    'updateSubcategory' => [
        'type' => $SubcategoryResponseType,
        'args' => [
            'id' => Type::nonNull(Type::string()),
            'input' => Type::nonNull($SubcategoryInputType)
        ],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => updateSubcategory($context['db'], $args['id'], $args['input']))
    ],
    'deleteSubcategory' => [
        'type' => $SubcategoryResponseType,
        'args' => ['id' => Type::nonNull(Type::string())],
        'resolve' => requireStoreAuth(fn($root, $args, $context) => deleteSubcategory($context['db'], $args['id']))
    ],
];
