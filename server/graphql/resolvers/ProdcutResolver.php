<?php

require_once __DIR__ . '/../../models/Product.php';
require_once __DIR__ . '/../../models/ProductVariant.php';


function getAllProducts(mysqli $db, array $data): array
{
    try {
        $model = new Product($db);
        $userId = $_SESSION['user']['id'] ?? null;
        $limit = $data['limit'] ?? 10;
        $offset = $data['offset'] ?? 0;
        $search = $data['search'] ?? '';

        $products = $model->findAll($userId, $limit, $offset, $search);
        $total = $model->getTotalCount($search);

        return [
            'success' => true,
            'message' => 'Products retrieved.',
            'products' => $products,
            'total' => $total
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'products' => [],
            'total' => 0
        ];
    }
}

function getProductById(mysqli $db, string $id): array
{
    try {
        $model = new Product($db);
        $product = $model->findById($id);

        return [
            'success' => $product !== null,
            'message' => $product ? 'Product found.' : 'Product not found.',
            'product' => $product
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}

function createProduct(mysqli $db, array $data): array
{
    try {
        $model = new Product($db);

        // Get store_id from context if available (for store authentication)
        $storeId = null;
        if (isset($_SESSION['store']['id'])) {
            $storeId = $_SESSION['store']['id'];
        }

        $product = $model->create($data, $storeId);

        return [
            'success' => true,
            'message' => 'Product created.',
            'product' => $product
        ];
    } catch (Exception $e) {
        error_log('createProduct error: ' . $e->getMessage());

        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}


function updateProduct(mysqli $db, array $args): array
{
    $id = $args['id'];

    try {
        if (!empty($args['images'])) {
            $args['images'] = array_map(fn($image) => [
                'image_url' => $image['image_url'],
                'is_primary' => $image['is_primary'] ?? false,
            ], $args['images']);
        }

        if (!empty($args['productOptions'])) {
            $args['productOptions'] = array_map(fn($opt) => [
                'name' => $opt['name'],
                'value' => $opt['value'],
                'type' => $opt['type'],
                'image_url' => $opt['image_url'] ?? '',
            ], $args['productOptions']);
        }

        if (!empty($args['productSpecifications'])) {
            $args['productSpecifications'] = array_map(fn($spec) => [
                'spec_name' => $spec['spec_name'],
                'spec_value' => $spec['spec_value'],
            ], $args['productSpecifications']);
        }

        if (!empty($args['productAttributes'])) {
            $args['productAttributes'] = array_map(fn($attr) => [
                'attribute_name' => $attr['attribute_name'],
                'attribute_value' => $attr['attribute_value'],
            ], $args['productAttributes']);
        }

        $model = new Product($db);
        $product = $model->update($id, $args);

        if (!$product) {
            return [
                'success' => false,
                'message' => 'Failed to update product.',
                'product' => null,
            ];
        }

        if (!empty($args['images'])) {
            $imageModel = new ProductImage($db);
            $imageModel->replaceForProduct($id, $args['images']);
        }

        if (!empty($args['productOptions'])) {
            $optionModel = new ProductOption($db);
            $optionModel->replaceForProduct($id, $args['productOptions']);
        }

        if (!empty($args['productSpecifications'])) {
            $specModel = new ProductSpecification($db);
            $specModel->replaceForProduct($id, $args['productSpecifications']);
        }

        if (!empty($args['productAttributes'])) {
            require_once __DIR__ . '/../../models/ProductAttribute.php';
            $attrModel = new ProductAttribute($db);
            $attrModel->replaceForProduct($id, $args['productAttributes']);
        }

        $updated = $model->findById($id);

        return [
            'success' => true,
            'message' => 'Product updated successfully.',
            'product' => $updated,
        ];
    } catch (Exception $e) {
        error_log('updateProduct error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null,
        ];
    }
}


/**
 * Generate Cartesian product of option groups into list of option combinations.
 * Each option group: ['name' => string, 'values' => string[]]
 * Returns array of combinations, each combination is an array of ['name' => ..., 'value' => ...]
 */
function generateOptionCombinations(array $optionGroups): array
{
    $result = [[]];
    foreach ($optionGroups as $group) {
        $next = [];
        $groupName = $group['name'];
        $values = $group['values'] ?? [];
        foreach ($result as $combo) {
            foreach ($values as $val) {
                $next[] = array_merge($combo, [
                    [
                        'name' => $groupName,
                        'value' => $val,
                    ]
                ]);
            }
        }
        $result = $next;
    }
    return $result;
}

function createProductWithVariants(mysqli $db, array $args): array
{
    $db->begin_transaction();
    try {
        // Create base product using existing model
        $productModel = new Product($db);

        // Map inputs to Product::create
        $baseProductData = [
            'name' => $args['name'],
            'price' => $args['price'],
            'currency' => $args['currency'] ?? 'USD',
            'product_overview' => $args['product_overview'] ?? null,
            'is_returnable' => $args['is_returnable'] ?? false,
            'discount' => $args['discount'] ?? null,
            'images' => $args['images'] ?? [],
            'productOptions' => [],
            'productSpecifications' => $args['specifications'] ?? [],
        ];

        // If options provided as groups, also flatten them into product_options rows for display/filtering
        if (!empty($args['options'])) {
            foreach ($args['options'] as $group) {
                $groupName = $group['name'];
                $type = $group['type'] ?? 'link';
                foreach ($group['values'] as $val) {
                    $baseProductData['productOptions'][] = [
                        'name' => $groupName,
                        'value' => $val,
                        'type' => $type,
                        'image_url' => '',
                    ];
                }
            }
        }

        // Get store_id from context if available (for store authentication)
        $storeId = null;
        if (isset($_SESSION['store']['id'])) {
            $storeId = $_SESSION['store']['id'];
        }

        $product = $productModel->create($baseProductData, $storeId);
        if (!$product) {
            throw new Exception('Failed to create product');
        }

        $productId = $product['id'];

        // Create variants
        $variantModel = new ProductVariant($db);

        $variantsInput = $args['variants'] ?? [];
        if (empty($variantsInput) && !empty($args['options'])) {
            // Generate variants from Cartesian product if not explicitly provided
            $combos = generateOptionCombinations($args['options']);
            // Assign SKUs automatically with base product id and index
            $i = 1;
            foreach ($combos as $combo) {
                $sku = $productId . '-' . str_pad((string) $i, 3, '0', STR_PAD_LEFT);
                $created = $variantModel->create($productId, $sku, $combo, null, null, null);
                if (!$created) {
                    throw new Exception('Failed to create generated variant');
                }
                $i++;
            }
        } else {
            foreach ($variantsInput as $v) {
                $sku = $v['sku'];
                $options = $v['options'] ?? [];
                $price = $v['price'] ?? null;
                $stock = $v['stock'] ?? null;
                $imageUrl = $v['image_url'] ?? null;
                $created = $variantModel->create($productId, $sku, $options, $price, $stock, $imageUrl);
                if (!$created) {
                    throw new Exception('Failed to create variant');
                }
            }
        }

        $db->commit();

        // Return nested product with variants included
        $full = $productModel->findById($productId);
        $full['variants'] = $variantModel->findByProductId($productId);

        return [
            'success' => true,
            'message' => 'Product with variants created.',
            'product' => $full,
        ];
    } catch (Exception $e) {
        $db->rollback();
        error_log('createProductWithVariants error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}

function getProductBySku(mysqli $db, string $sku): array
{
    try {
        $variantModel = new ProductVariant($db);
        $variant = $variantModel->findBySku($sku);

        if (!$variant) {
            return [
                'success' => false,
                'message' => 'Product variant not found',
                'product' => null
            ];
        }

        // Get the product for this variant
        $productModel = new Product($db);
        $product = $productModel->findById($variant['product_id']);

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
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}

function getRelatedProducts(mysqli $db, string $productId, int $limit = 8): array
{
    try {
        $productModel = new Product($db);

        // Get the current product to find its category and brand
        $currentProduct = $productModel->findById($productId);
        if (!$currentProduct) {
            return [
                'success' => false,
                'message' => 'Product not found.',
                'products' => []
            ];
        }

        // Find related products based on category and brand
        $relatedProducts = $productModel->findRelatedProducts(
            $productId,
            $currentProduct['category_id'],
            $currentProduct['brand_id'],
            $limit
        );

        return [
            'success' => true,
            'message' => 'Related products retrieved successfully.',
            'products' => $relatedProducts
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'products' => []
        ];
    }
}

function getRelatedVariants(mysqli $db, string $productId): array
{
    try {
        $variantModel = new ProductVariant($db);
        $productModel = new Product($db);

        // Get the current product to find its base name or category
        $currentProduct = $productModel->findById($productId);
        if (!$currentProduct) {
            return [
                'success' => false,
                'message' => 'Product not found.',
                'variants' => []
            ];
        }

        // For now, we'll return variants that share similar names or are in the same category
        // This is a simplified approach - in a real system you might have a separate table
        // to define product relationships or use more sophisticated matching
        $relatedVariants = $variantModel->findRelatedVariants($productId, $currentProduct['name']);

        // Enrich variants with product information
        $enrichedVariants = [];
        foreach ($relatedVariants as $variant) {
            $variantProduct = $productModel->findById($variant['product_id']);
            $variant['product'] = [
                'id' => $variantProduct['id'],
                'name' => $variantProduct['name']
            ];
            $enrichedVariants[] = $variant;
        }

        return [
            'success' => true,
            'message' => 'Related variants retrieved.',
            'variants' => $enrichedVariants
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'variants' => []
        ];
    }
}

function deleteProduct(mysqli $db, string $id): array
{
    try {
        $model = new Product($db);
        $deleted = $model->delete($id);

        return [
            'success' => $deleted,
            'message' => $deleted ? 'Product deleted successfully.' : 'Product not found or could not be deleted.',
        ];
    } catch (Exception $e) {
        error_log('deleteProduct error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
        ];
    }
}

function generateVariantsForProduct(mysqli $db, string $productId): array
{
    try {
        $productModel = new Product($db);
        $variants = $productModel->generateVariants($productId);

        if (empty($variants)) {
            return [
                'success' => false,
                'message' => 'No variants generated. Make sure the product has options defined.',
                'product' => null
            ];
        }

        // Return updated product with variants
        $product = $productModel->findById($productId);

        return [
            'success' => true,
            'message' => count($variants) . ' variants generated successfully.',
            'product' => $product
        ];
    } catch (Exception $e) {
        error_log('generateVariantsForProduct error: ' . $e->getMessage());
        return [
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
            'product' => null
        ];
    }
}

