<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

// Subcategory Type (defined first)
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

// Category Types
$CategoryType = new ObjectType([
    'name' => 'Category',
    'fields' => [
        'category_id' => Type::int(),
        'name' => Type::string(),
        'slug' => Type::string(),
        'description' => Type::string(),
        'is_active' => Type::boolean(),
        'created_at' => Type::string(),
        'updated_at' => Type::string(),
        'subcategories' => Type::listOf($SubcategoryType)
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
        'attributes' => Type::string(), // JSON string
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
        'attribute_values' => Type::listOf(Type::string()), // JSON array
        'is_required' => Type::boolean(),
        'display_order' => Type::int(),
        'created_at' => Type::string(),
        'updated_at' => Type::string()
    ]
]);

// Input Types
$CategoryInputType = new InputObjectType([
    'name' => 'CategoryInput',
    'fields' => [
        'name' => Type::nonNull(Type::string()),
        'slug' => Type::nonNull(Type::string()),
        'description' => Type::string(),
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
        'attributes' => Type::listOf(Type::string()) // Array of attribute names
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

// Response Types
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

$BrandsResponseType = new ObjectType([
    'name' => 'BrandsResponse',
    'fields' => [
        'success' => Type::boolean(),
        'message' => Type::string(),
        'brands' => Type::listOf($BrandType)
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

