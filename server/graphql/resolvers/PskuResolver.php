<?php

require_once __DIR__ . '/../../models/Category.php';
require_once __DIR__ . '/../../models/Subcategory.php';
require_once __DIR__ . '/../../models/Brand.php';
require_once __DIR__ . '/../../models/ProductGroup.php';
require_once __DIR__ . '/../../models/Product.php';

// Category Resolvers
function getCategories(mysqli $db, string $search = ''): array
{
    $categoryModel = new Category($db);

    try {
        if (empty($search)) {
            $categories = $categoryModel->getWithSubcategories();
        } else {
            $categories = $categoryModel->search($search);
        }

        return [
            'success' => true,
            'message' => 'Categories retrieved successfully',
            'categories' => $categories
        ];
    } catch (Exception $e) {
        error_log("Error getting categories: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve categories',
            'categories' => []
        ];
    }
}

function getCategory(mysqli $db, int $id): array
{
    $categoryModel = new Category($db);

    try {
        $category = $categoryModel->findById($id);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'category' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Category retrieved successfully',
            'category' => $category
        ];
    } catch (Exception $e) {
        error_log("Error getting category: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve category',
            'category' => null
        ];
    }
}

function createCategory(mysqli $db, array $input): array
{
    $categoryModel = new Category($db);

    try {
        $category = $categoryModel->create($input);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Failed to create category',
                'category' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Category created successfully',
            'category' => $category
        ];
    } catch (Exception $e) {
        error_log("Error creating category: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create category: ' . $e->getMessage(),
            'category' => null
        ];
    }
}

// Subcategory Resolvers
function getSubcategories(mysqli $db, ?int $categoryId = null, string $search = ''): array
{
    $subcategoryModel = new Subcategory($db);

    try {
        if ($categoryId) {
            $subcategories = $subcategoryModel->findByCategoryId($categoryId);
        } elseif (!empty($search)) {
            $subcategories = $subcategoryModel->search($search);
        } else {
            $subcategories = $subcategoryModel->findAll();
        }

        return [
            'success' => true,
            'message' => 'Subcategories retrieved successfully',
            'subcategories' => $subcategories
        ];
    } catch (Exception $e) {
        error_log("Error getting subcategories: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve subcategories',
            'subcategories' => []
        ];
    }
}

function createSubcategory(mysqli $db, array $input): array
{
    $subcategoryModel = new Subcategory($db);

    try {
        $subcategory = $subcategoryModel->create($input);

        if (!$subcategory) {
            return [
                'success' => false,
                'message' => 'Failed to create subcategory',
                'category' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Subcategory created successfully',
            'category' => $subcategory
        ];
    } catch (Exception $e) {
        error_log("Error creating subcategory: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create subcategory: ' . $e->getMessage(),
            'category' => null
        ];
    }
}

// Brand Resolvers
function getBrands(mysqli $db, string $search = ''): array
{
    $brandModel = new Brand($db);

    try {
        if (!empty($search)) {
            $brands = $brandModel->search($search);
        } else {
            $brands = $brandModel->findAll();
        }

        return [
            'success' => true,
            'message' => 'Brands retrieved successfully',
            'brands' => $brands
        ];
    } catch (Exception $e) {
        error_log("Error getting brands: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve brands',
            'brands' => []
        ];
    }
}

function createBrand(mysqli $db, array $input): array
{
    $brandModel = new Brand($db);

    try {
        $brand = $brandModel->create($input);

        if (!$brand) {
            return [
                'success' => false,
                'message' => 'Failed to create brand',
                'category' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Brand created successfully',
            'category' => $brand
        ];
    } catch (Exception $e) {
        error_log("Error creating brand: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create brand: ' . $e->getMessage(),
            'category' => null
        ];
    }
}

// Product Group Resolvers
function getProductGroups(mysqli $db, ?int $categoryId = null): array
{
    $groupModel = new ProductGroup($db);

    try {
        if ($categoryId) {
            $groups = $groupModel->findByCategoryId($categoryId);
        } else {
            $groups = $groupModel->findAll();
        }

        return [
            'success' => true,
            'message' => 'Product groups retrieved successfully',
            'groups' => $groups
        ];
    } catch (Exception $e) {
        error_log("Error getting product groups: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve product groups',
            'groups' => []
        ];
    }
}

function createProductGroup(mysqli $db, array $input): array
{
    $groupModel = new ProductGroup($db);

    try {
        $group = $groupModel->create($input);

        if (!$group) {
            return [
                'success' => false,
                'message' => 'Failed to create product group',
                'group' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Product group created successfully',
            'group' => $group
        ];
    } catch (Exception $e) {
        error_log("Error creating product group: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create product group: ' . $e->getMessage(),
            'group' => null
        ];
    }
}

function updateProductGroup(mysqli $db, array $args): array
{
    $groupModel = new ProductGroup($db);

    try {
        $groupId = $args['groupId'];
        $updateData = [];

        if (isset($args['name'])) {
            $updateData['name'] = $args['name'];
        }
        if (isset($args['description'])) {
            $updateData['description'] = $args['description'];
        }
        if (isset($args['attributes'])) {
            $updateData['attributes'] = json_encode($args['attributes']);
        }

        $group = $groupModel->update($groupId, $updateData);

        if (!$group) {
            return [
                'success' => false,
                'message' => 'Failed to update product group',
                'group' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Product group updated successfully',
            'group' => $group
        ];
    } catch (Exception $e) {
        error_log("Error updating product group: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to update product group: ' . $e->getMessage(),
            'group' => null
        ];
    }
}

function deleteProductGroup(mysqli $db, string $groupId): array
{
    $groupModel = new ProductGroup($db);

    try {
        $success = $groupModel->delete($groupId);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to delete product group'
            ];
        }

        return [
            'success' => true,
            'message' => 'Product group deleted successfully'
        ];
    } catch (Exception $e) {
        error_log("Error deleting product group: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to delete product group: ' . $e->getMessage()
        ];
    }
}

function addProductToGroup(mysqli $db, string $productId, string $groupId): array
{
    $groupModel = new ProductGroup($db);
    $productModel = new Product($db);

    try {
        $success = $groupModel->addProductToGroup($groupId, $productId);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to add product to group',
                'product' => null
            ];
        }

        $product = $productModel->findById($productId);

        return [
            'success' => true,
            'message' => 'Product added to group successfully',
            'product' => $product
        ];
    } catch (Exception $e) {
        error_log("Error adding product to group: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to add product to group: ' . $e->getMessage(),
            'product' => null
        ];
    }
}

// Product PSKU Resolvers
function getProductByPsku(mysqli $db, string $psku): array
{
    $productModel = new Product($db);

    try {
        $product = $productModel->findByPsku($psku);

        if (!$product) {
            return [
                'success' => false,
                'message' => 'Product not found',
                'product' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Product retrieved successfully',
            'product' => $product
        ];
    } catch (Exception $e) {
        error_log("Error getting product by PSKU: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve product',
            'product' => null
        ];
    }
}
