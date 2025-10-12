<?php

require_once __DIR__ . '/../../models/Category.php';
require_once __DIR__ . '/../../models/Subcategory.php';
require_once __DIR__ . '/../../models/Brand.php';
require_once __DIR__ . '/../../models/ProductGroup.php';
require_once __DIR__ . '/../../models/Product.php';


function mapChildrenToSubcategories(&$category)
{
    if (isset($category['children']) && is_array($category['children'])) {

        foreach ($category['children'] as &$child) {
            mapChildrenToSubcategories($child);
        }


        $category['subcategories'] = array_map(function ($child) {
            return [
                'subcategory_id' => $child['category_id'],
                'category_id' => $child['parent_id'],
                'name' => $child['name'],
                'slug' => $child['slug'],
                'description' => $child['description'] ?? null,
                'is_active' => $child['is_active'] ?? true,
                'created_at' => $child['created_at'] ?? null,
                'updated_at' => $child['updated_at'] ?? null,
                'subcategories' => $child['subcategories'] ?? []
            ];
        }, $category['children']);
    } else {
        $category['subcategories'] = [];
    }
}

function getCategories(mysqli $db, ?int $parentId = null, bool $includeChildren = true, string $search = ''): array
{
    $categoryModel = new Category($db);

    try {
        if (!empty($search)) {
            $categories = $categoryModel->search($search);
        } else if ($includeChildren) {
            $categories = $categoryModel->getCategoryTree($parentId);
        } else {
            $categories = $categoryModel->findByParentId($parentId);
        }


        foreach ($categories as &$category) {
            $countQuery = "SELECT COUNT(*) as count FROM products WHERE category_id = ?";
            $stmt = $db->prepare($countQuery);
            $stmt->bind_param('i', $category['category_id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $count = $result->fetch_assoc();
            $category['product_count'] = $count['count'] ?? 0;


            mapChildrenToSubcategories($category);
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

function getCategory(mysqli $db, int $id, bool $includeChildren = false): array
{
    $categoryModel = new Category($db);

    try {
        $category = $categoryModel->findById($id, $includeChildren);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'category' => null
            ];
        }


        mapChildrenToSubcategories($category);

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

function updateCategory(mysqli $db, int $id, array $input): array
{
    $categoryModel = new Category($db);

    try {
        $category = $categoryModel->update($id, $input);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Failed to update category',
                'category' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Category updated successfully',
            'category' => $category
        ];
    } catch (Exception $e) {
        error_log("Error updating category: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to update category: ' . $e->getMessage(),
            'category' => null
        ];
    }
}

function deleteCategory(mysqli $db, int $id): array
{
    $categoryModel = new Category($db);

    try {
        $deleted = $categoryModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Failed to delete category'
            ];
        }

        return [
            'success' => true,
            'message' => 'Category deleted successfully'
        ];
    } catch (Exception $e) {
        error_log("Error deleting category: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to delete category: ' . $e->getMessage()
        ];
    }
}


function getCategoryBreadcrumb(mysqli $db, int $categoryId): array
{
    $categoryModel = new Category($db);

    try {
        $breadcrumb = $categoryModel->getBreadcrumb($categoryId);

        return [
            'success' => true,
            'message' => 'Breadcrumb retrieved successfully',
            'breadcrumb' => $breadcrumb
        ];
    } catch (Exception $e) {
        error_log("Error getting breadcrumb: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve breadcrumb',
            'breadcrumb' => []
        ];
    }
}

function getCategoryBySlug(mysqli $db, string $slug, bool $includeChildren = true): array
{
    $categoryModel = new Category($db);

    try {
        $category = $categoryModel->findBySlug($slug, $includeChildren);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'category' => null
            ];
        }


        $countQuery = "SELECT COUNT(*) as count FROM products WHERE category_id = ?";
        $stmt = $db->prepare($countQuery);
        $stmt->bind_param('i', $category['category_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc();
        $category['product_count'] = $count['count'] ?? 0;


        mapChildrenToSubcategories($category);

        return [
            'success' => true,
            'message' => 'Category retrieved successfully',
            'category' => $category
        ];
    } catch (Exception $e) {
        error_log("Error getting category by slug: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve category',
            'category' => null
        ];
    }
}

function getCategoryByNestedPath(mysqli $db, string $path, bool $includeChildren = true): array
{
    $categoryModel = new Category($db);

    try {
        $category = $categoryModel->findByNestedPath($path, $includeChildren);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Category not found',
                'category' => null
            ];
        }


        $countQuery = "SELECT COUNT(*) as count FROM products WHERE category_id = ?";
        $stmt = $db->prepare($countQuery);
        $stmt->bind_param('i', $category['category_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $count = $result->fetch_assoc();
        $category['product_count'] = $count['count'] ?? 0;


        mapChildrenToSubcategories($category);

        return [
            'success' => true,
            'message' => 'Category retrieved successfully',
            'category' => $category
        ];
    } catch (Exception $e) {
        error_log("Error getting category by nested path: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to retrieve category',
            'category' => null
        ];
    }
}

function moveCategory(mysqli $db, int $categoryId, ?int $newParentId = null): array
{
    $categoryModel = new Category($db);

    try {
        $moved = $categoryModel->moveCategory($categoryId, $newParentId);

        if (!$moved) {
            return [
                'success' => false,
                'message' => 'Failed to move category'
            ];
        }

        return [
            'success' => true,
            'message' => 'Category moved successfully'
        ];
    } catch (Exception $e) {
        error_log("Error moving category: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to move category: ' . $e->getMessage()
        ];
    }
}

function getSubcategories(mysqli $db, ?int $categoryId = null, string $search = ''): array
{
    try {
        $categoryModel = new Category($db);

        if ($categoryId) {

            $subcategories = $categoryModel->findByParentId($categoryId);
        } elseif (!empty($search)) {

            $allCategories = $categoryModel->search($search);
            $subcategories = array_filter($allCategories, function ($category) {
                return $category['parent_id'] !== null;
            });
        } else {

            $allCategories = $categoryModel->findAll();
            $subcategories = array_filter($allCategories, function ($category) {
                return $category['parent_id'] !== null;
            });
        }


        $mappedSubcategories = array_map(function ($category) {
            return [
                'subcategory_id' => $category['category_id'],
                'category_id' => $category['parent_id'],
                'name' => $category['name'],
                'slug' => $category['slug'],
                'description' => $category['description'],
                'is_active' => $category['is_active'],
                'created_at' => $category['created_at'],
                'updated_at' => $category['updated_at']
            ];
        }, $subcategories);

        return [
            'success' => true,
            'message' => 'Subcategories retrieved successfully',
            'subcategories' => $mappedSubcategories
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
    $categoryModel = new Category($db);

    try {

        $categoryData = [
            'parent_id' => $input['category_id'],
            'name' => $input['name'],
            'slug' => $input['slug'],
            'description' => $input['description'] ?? null,
            'display_order' => 0,
            'image_url' => null,
            'icon_url' => null,
            'is_active' => $input['is_active'] ?? true
        ];

        $category = $categoryModel->create($categoryData);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Failed to create subcategory',
                'subcategory' => null
            ];
        }


        $subcategory = [
            'subcategory_id' => $category['category_id'],
            'category_id' => $category['parent_id'],
            'name' => $category['name'],
            'slug' => $category['slug'],
            'description' => $category['description'],
            'is_active' => $category['is_active'],
            'created_at' => $category['created_at'],
            'updated_at' => $category['updated_at']
        ];

        return [
            'success' => true,
            'message' => 'Subcategory created successfully',
            'subcategory' => $subcategory
        ];
    } catch (Exception $e) {
        error_log("Error creating subcategory: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create subcategory: ' . $e->getMessage(),
            'subcategory' => null
        ];
    }
}

function updateSubcategory(mysqli $db, int $id, array $input): array
{
    $categoryModel = new Category($db);

    try {

        $categoryData = [];

        if (isset($input['name'])) {
            $categoryData['name'] = $input['name'];
        }
        if (isset($input['slug'])) {
            $categoryData['slug'] = $input['slug'];
        }
        if (isset($input['description'])) {
            $categoryData['description'] = $input['description'];
        }
        if (isset($input['is_active'])) {
            $categoryData['is_active'] = $input['is_active'];
        }

        $category = $categoryModel->update($id, $categoryData);

        if (!$category) {
            return [
                'success' => false,
                'message' => 'Failed to update subcategory',
                'subcategory' => null
            ];
        }


        $subcategory = [
            'subcategory_id' => $category['category_id'],
            'category_id' => $category['parent_id'],
            'name' => $category['name'],
            'slug' => $category['slug'],
            'description' => $category['description'],
            'is_active' => $category['is_active'],
            'created_at' => $category['created_at'],
            'updated_at' => $category['updated_at']
        ];

        return [
            'success' => true,
            'message' => 'Subcategory updated successfully',
            'subcategory' => $subcategory
        ];
    } catch (Exception $e) {
        error_log("Error updating subcategory: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to update subcategory: ' . $e->getMessage(),
            'subcategory' => null
        ];
    }
}

function deleteSubcategory(mysqli $db, int $id): array
{
    $categoryModel = new Category($db);

    try {
        $deleted = $categoryModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Failed to delete subcategory'
            ];
        }

        return [
            'success' => true,
            'message' => 'Subcategory deleted successfully'
        ];
    } catch (Exception $e) {
        error_log("Error deleting subcategory: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to delete subcategory: ' . $e->getMessage()
        ];
    }
}


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
                'brand' => null
            ];
        }

        return [
            'success' => true,
            'message' => 'Brand created successfully',
            'brand' => $brand
        ];
    } catch (Exception $e) {
        error_log("Error creating brand: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to create brand: ' . $e->getMessage(),
            'brand' => null
        ];
    }
}

function updateBrand(mysqli $db, int $id, array $input): array
{
    $brandModel = new Brand($db);

    try {
        $success = $brandModel->update($id, $input);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to update brand',
                'brand' => null
            ];
        }

        $brand = $brandModel->findById($id);

        return [
            'success' => true,
            'message' => 'Brand updated successfully',
            'brand' => $brand
        ];
    } catch (Exception $e) {
        error_log("Error updating brand: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to update brand: ' . $e->getMessage(),
            'brand' => null
        ];
    }
}

function deleteBrand(mysqli $db, int $id): array
{
    $brandModel = new Brand($db);
    $productModel = new Product($db);

    try {

        $products = $productModel->findByBrandId($id);
        if (!empty($products)) {
            return [
                'success' => false,
                'message' => 'Cannot delete brand with products. Please remove all products first.'
            ];
        }

        $success = $brandModel->delete($id);

        if (!$success) {
            return [
                'success' => false,
                'message' => 'Failed to delete brand'
            ];
        }

        return [
            'success' => true,
            'message' => 'Brand deleted successfully'
        ];
    } catch (Exception $e) {
        error_log("Error deleting brand: " . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Failed to delete brand: ' . $e->getMessage()
        ];
    }
}


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


function getProductByPsku(mysqli $db, string $psku): array
{
    $productModel = new Product($db);

    try {

        $publicOnly = !isset($_SESSION['store']['id']);

        $product = $productModel->findByPsku($psku, $publicOnly);

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


function validatePskuUniqueness(mysqli $db, string $psku): bool
{
    try {
        error_log("NEW VALIDATION ENDPOINT CALLED for PSKU: '$psku'");


        $query = "SELECT id, name FROM products WHERE psku = ? LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bind_param('s', $psku);
        $stmt->execute();
        $result = $stmt->get_result();

        $isAvailable = $result->num_rows === 0;

        if (!$isAvailable) {
            $existingProduct = $result->fetch_assoc();
            error_log("PSKU '$psku' already exists for product ID: {$existingProduct['id']}, Name: {$existingProduct['name']}");
        } else {
            error_log("PSKU '$psku' is available - returning TRUE");
        }


        return $isAvailable;
    } catch (Exception $e) {
        error_log("Error validating PSKU uniqueness: " . $e->getMessage());

        return false;
    }
}
