<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;


// Forward declaration for recursive type
$CategoryType = null;
$SubcategoryType = null;

// Define SubcategoryType for backward compatibility
$SubcategoryType = new ObjectType([
    'name' => 'Subcategory',
    'fields' => [
        'subcategory_id' => Type::int(),
        'category_id' => Type::int(),
        'name' => Type::string(),
        'slug' => Type::string(),
        'description' => Type::string(),
        'is_active' => Type::boolean(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$CategoryType = new ObjectType([
    'name' => 'Category',
    'fields' => function() use (&$CategoryType, $SubcategoryType) {
        return [
            'category_id' => Type::int(),
            'parent_id' => Type::int(),
            'name' => Type::string(),
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
            'children' => Type::listOf($CategoryType),
            'subcategories' => Type::listOf($SubcategoryType), // Backward compatibility
            'product_count' => Type::int()
        ];
    }
]);

$CategoryBreadcrumbType = new ObjectType([
    'name' => 'CategoryBreadcrumb',
    'fields' => [
        'id' => Type::int(),
        'name' => Type::string(),
        'slug' => Type::string(),
        'level' => Type::int()
    ]
]);

$BrandType = new ObjectType([
    'name' => 'Brand',
    'fields' => [
        'brand_id' => Type::int(),
        'name' => Type::string(),
        'slug' => Type::string(),
        'description' => Type::string(),
        'logo_url' => Type::string(),
        'is_active' => Type::boolean(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$ProductGroupType = new ObjectType([
    'name' => 'ProductGroup',
    'fields' => [
        'group_id' => Type::string(),
        'name' => Type::string(),
        'description' => Type::string(),
        'category_id' => Type::int(),
        'subcategory_id' => Type::int(),
        'brand_id' => Type::int(),
        'attributes' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$ProductAttributeType = new ObjectType([
    'name' => 'ProductAttribute',
    'fields' => [
        'id' => Type::int(),
        'product_id' => Type::string(),
        'attribute_name' => Type::string(),
        'attribute_value' => Type::string(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

$GroupAttributeType = new ObjectType([
    'name' => 'GroupAttribute',
    'fields' => [
        'id' => Type::int(),
        'group_id' => Type::string(),
        'attribute_name' => Type::string(),
        'attribute_values' => Type::listOf(Type::string()),
        'is_required' => Type::boolean(),
        'display_order' => Type::int(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);


$CategoryInputType = new InputObjectType([
    'name' => 'CategoryInput',
    'fields' => [
        'parent_id' => Type::int(),
        'name' => Type::nonNull(Type::string()),
        'slug' => Type::nonNull(Type::string()),
        'description' => Type::string(),
        'display_order' => Type::int(),
        'image_url' => Type::string(),
        'icon_url' => Type::string(),
        'is_active' => Type::boolean()
    ]
]);

$SubcategoryInputType = new InputObjectType([
    'name' => 'SubcategoryInput',
    'fields' => [
        'category_id' => Type::nonNull(Type::int()),
        'name' => Type::nonNull(Type::string()),
        'slug' => Type::nonNull(Type::string()),
        'description' => Type::string(),
        'is_active' => Type::boolean()
    ]
]);

$BrandInputType = new InputObjectType([
    'name' => 'BrandInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'slug' => Type::nonNull(Type::string()),
        'description' => Type::string(),
        'logo_url' => Type::string(),
        'is_active' => Type::boolean()
    ]
]);

$ProductGroupInputType = new InputObjectType([
    'name' => 'ProductGroupInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'description' => Type::string(),
        'category_id' => Type::int(),
        'subcategory_id' => Type::int(),
        'brand_id' => Type::int(),
        'attributes' => Type::listOf(Type::string())
    ]
]);

$ProductAttributeInputType = new InputObjectType([
    'name' => 'ProductAttributeInput',
    'fields' => [
        'attribute_name' => Type::nonNull(Type::string()),
        'attribute_value' => Type::nonNull(Type::string())
    ]
]);

$GroupAttributeInputType = new InputObjectType([
    'name' => 'GroupAttributeInput',
    'fields' => [
        'attribute_name' => Type::nonNull(Type::string()),
        'attribute_values' => Type::listOf(Type::string()),
        'is_required' => Type::boolean(),
        'display_order' => Type::int()
    ]
]);


$CategoriesResponseType = new ObjectType([
    'name' => 'CategoriesResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'categories' => Type::listOf($CategoryType)
    ]
]);

$CategoryResponseType = new ObjectType([
    'name' => 'CategoryResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'category' => $CategoryType
    ]
]);

$SubcategoriesResponseType = new ObjectType([
    'name' => 'SubcategoriesResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'subcategories' => Type::listOf($SubcategoryType)
    ]
]);

$SubcategoryResponseType = new ObjectType([
    'name' => 'SubcategoryResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'subcategory' => $SubcategoryType
    ]
]);

$BrandsResponseType = new ObjectType([
    'name' => 'BrandsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'brands' => Type::listOf($BrandType)
    ]
]);

$BrandResponseType = new ObjectType([
    'name' => 'BrandResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'brand' => $BrandType
    ]
]);

$ProductGroupsResponseType = new ObjectType([
    'name' => 'ProductGroupsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'groups' => Type::listOf($ProductGroupType)
    ]
]);

$ProductGroupResponseType = new ObjectType([
    'name' => 'ProductGroupResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'group' => $ProductGroupType
    ]
]);

