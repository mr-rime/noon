<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . '/ProductImage.php';
require_once __DIR__ . '/ProductSpecification.php';
require_once __DIR__ . '/Discount.php';
require_once __DIR__ . '/ProductGroup.php';
require_once __DIR__ . '/Category.php';
require_once __DIR__ . '/Subcategory.php';
require_once __DIR__ . '/Brand.php';
require_once __DIR__ . '/../utils/generateHash.php';

class Product
{
    private mysqli $db;
    private Discount $discountModel;
    private ProductSpecification $specModel;
    private ProductImage $imageModel;
    private ProductGroup $groupModel;
    private Category $categoryModel;
    private Subcategory $subcategoryModel;
    private Brand $brandModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->discountModel = new Discount($db);
        $this->specModel = new ProductSpecification($db);
        $this->imageModel = new ProductImage($db);
        $this->groupModel = new ProductGroup($db);
        $this->categoryModel = new Category($db);
        $this->subcategoryModel = new Subcategory($db);
        $this->brandModel = new Brand($db);
    }

    /* -------------------- DISCOUNT HELPERS -------------------- */

    private function calculateFinalPrice(float $price, ?array $discount): float
    {
        if (!$discount)
            return $price;

        return match ($discount['type']) {
            'percentage' => max($price - ($price * $discount['value'] / 100), 0),
            'fixed' => max($price - $discount['value'], 0),
            default => $price,
        };
    }

    private function getDiscountPercentage(float $price, ?array $discount): ?float
    {
        if (!$discount)
            return null;

        return match ($discount['type']) {
            'percentage' => $discount['value'],
            'fixed' => $price > 0 ? round(($discount['value'] / $price) * 100, 2) : null,
            default => null,
        };
    }

    private function resolveDiscount(?array $discount): ?array
    {
        if (!$discount)
            return null;

        $now = new DateTime();
        $startsAt = !empty($discount['starts_at']) ? new DateTime($discount['starts_at']) : null;
        $endsAt = !empty($discount['ends_at']) ? new DateTime($discount['ends_at']) : null;

        $isActive = (!$startsAt || $now >= $startsAt) && (!$endsAt || $now <= $endsAt);

        return $isActive ? $discount : null;
    }

    public function attachDiscountData(array &$product, float $price): void
    {
        $discount = $this->resolveDiscount(
            $this->discountModel->findByProductId($product['id'])
        );

        $product['discount'] = $discount;
        $product['final_price'] = $this->calculateFinalPrice($price, $discount);
        $product['discount_percentage'] = $this->getDiscountPercentage($price, $discount);
    }

    /* -------------------- QUERY HELPERS -------------------- */

    private function fetchAssocAll(mysqli_stmt $stmt): array
    {
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    private function buildWhereSearch(string $search): array
    {
        if (empty(trim($search))) {
            return ['', 'ORDER BY id', [], ''];
        }

        $where = "WHERE name LIKE CONCAT('%', ?, '%') OR product_overview LIKE CONCAT('%', ?, '%')";
        $order = "
            ORDER BY CASE
                WHEN name = ? THEN 1
                WHEN name LIKE CONCAT(?, '%') THEN 2
                WHEN name LIKE CONCAT('%', ?, '%') THEN 3
                WHEN product_overview LIKE CONCAT('%', ?, '%') THEN 4
                ELSE 5
            END, id";
        $params = array_fill(0, 6, $search);
        $types = 'ssssss';

        return [$where, $order, $params, $types];
    }

    /* -------------------- PUBLIC METHODS -------------------- */

    public function findAll(?int $userId, int $limit = 10, int $offset = 0, string $search = ''): array
    {
        [$where, $order, $params, $types] = $this->buildWhereSearch($search);

        // First fetch product IDs
        $query = "SELECT id FROM products $where $order LIMIT ? OFFSET ?";
        $params = [...$params, $limit, $offset];
        $types .= 'ii';

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($types, ...$params);
        $productIds = array_column($this->fetchAssocAll($stmt), 'id');

        if (!$productIds)
            return [];

        // Wishlist joins
        $wishlistJoin = $wishlistSelect = '';
        $wishlistParams = [];
        $wishlistTypes = '';
        if ($userId) {
            $wishlistJoin = "
                LEFT JOIN wishlist_items wi ON wi.product_id = p.id
                LEFT JOIN wishlists w ON wi.wishlist_id = w.id AND w.user_id = ?";
            $wishlistSelect = "CASE WHEN w.id IS NOT NULL THEN 1 ELSE 0 END AS is_in_wishlist, w.id AS wishlist_id,";
            $wishlistParams = [$userId];
            $wishlistTypes = 'i';
        }

        // Main fetch with new PSKU system joins
        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
            SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary, $wishlistSelect
                   c.name as category_name, s.name as subcategory_name, b.name as brand_name,
                   pg.name as group_name, pg.group_id,
                   0 as dummy -- ensures trailing comma handled
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN subcategories s ON p.subcategory_id = s.subcategory_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_groups pg ON p.group_id = pg.group_id
            $wishlistJoin
            WHERE p.id IN ($placeholders)
            ORDER BY p.id";

        $stmt = $this->db->prepare($query);
        $params = array_merge($wishlistParams, $productIds);
        $stmt->bind_param($wishlistTypes . str_repeat('i', count($productIds)), ...$params);
        $rows = $this->fetchAssocAll($stmt);

        // Group rows
        $products = [];
        foreach ($rows as $row) {
            $pid = $row['id'];
            $products[$pid] ??= [
                'id' => $pid,
                'psku' => $row['psku'],
                'name' => $row['name'],
                'price' => $row['price'],
                'currency' => $row['currency'],
                'stock' => $row['stock'],
                'product_overview' => $row['product_overview'],
                'is_returnable' => $row['is_returnable'],
                'final_price' => $row['final_price'],
                'category_id' => $row['category_id'],
                'subcategory_id' => $row['subcategory_id'],
                'brand_id' => $row['brand_id'],
                'group_id' => $row['group_id'],
                'category_name' => $row['category_name'],
                'subcategory_name' => $row['subcategory_name'],
                'brand_name' => $row['brand_name'],
                'group_name' => $row['group_name'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
                'is_in_wishlist' => (bool) ($row['is_in_wishlist'] ?? 0),
                'wishlist_id' => $row['wishlist_id'] ?? null,
                'images' => [],
            ];

            if ($row['image_id']) {
                $products[$pid]['images'][] = [
                    'id' => $row['image_id'],
                    'image_url' => $row['image_url'],
                    'is_primary' => (bool) $row['is_primary'],
                ];
            }
        }

        // Attach related data
        foreach ($products as $pid => &$product) {
            $product['productSpecifications'] = $this->specModel->findByProductId($pid);

            // Get product attributes if part of a group
            if ($product['group_id']) {
                $product['groupAttributes'] = $this->groupModel->getGroupAttributes($product['group_id']);
                $product['productAttributes'] = $this->getProductAttributes($pid);
            } else {
                $product['groupAttributes'] = [];
                $product['productAttributes'] = [];
            }

            $this->attachDiscountData($product, $product['price']);
        }

        return array_values($products);
    }

    public function getTotalCount(string $search = ''): int
    {
        [$where, $order, $params, $types] = $this->buildWhereSearch($search);

        $query = "SELECT COUNT(*) as total FROM products $where";
        $stmt = $this->db->prepare($query);

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $result = $this->fetchAssocAll($stmt);
        return (int) ($result[0]['total'] ?? 0);
    }

    public function findRelatedProducts(string $productId, ?int $categoryId, ?int $brandId, int $limit = 8): array
    {
        // Get current product to exclude products from the same group
        $currentProduct = $this->findById($productId);
        $excludeGroupId = $currentProduct['group_id'] ?? null;

        $query = "
            SELECT DISTINCT p.id, p.name, p.price, p.currency, p.stock, p.product_overview, p.category_id,
                   c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.id != ?";

        $params = [$productId];
        $types = 's';

        // Add category filter if available
        if ($categoryId) {
            $query .= " AND p.category_id = ?";
            $params[] = $categoryId;
            $types .= 'i';
        }

        $query .= " ORDER BY 
            CASE 
                WHEN p.category_id = ? THEN 1
                ELSE 2
            END, p.name ASC
            LIMIT ?";

        // Add ordering parameters
        $params[] = $categoryId;
        $params[] = $limit;
        $types .= 'ii';

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            return [];
        }

        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        // Get images and other related data for each product
        foreach ($products as $pid => &$product) {
            // Add missing columns with default values
            $product['psku'] = null;
            $product['subcategory_id'] = null;
            $product['brand_id'] = null;
            $product['group_id'] = null;
            $product['subcategory_name'] = null;
            $product['brand_name'] = null;
            $product['group_name'] = null;
            $product['final_price'] = $product['price']; // Use price as final_price
            $product['discount_percentage'] = 0;
            $product['created_at'] = $product['created_at'] ?? null;
            $product['updated_at'] = $product['updated_at'] ?? null;

            $product['productSpecifications'] = $this->specModel->findByProductId($product['id']);

            // Get images for this product
            $imageQuery = 'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC';
            $imageStmt = $this->db->prepare($imageQuery);
            if ($imageStmt) {
                $imageStmt->bind_param('s', $product['id']);
                $imageStmt->execute();
                $imageResult = $imageStmt->get_result();
                $product['images'] = [];
                while ($imageRow = $imageResult->fetch_assoc()) {
                    $product['images'][] = [
                        'id' => $imageRow['id'],
                        'image_url' => $imageRow['image_url'],
                        'is_primary' => (bool) $imageRow['is_primary']
                    ];
                }
            } else {
                $product['images'] = [];
            }

            // Get product attributes (simplified - no group logic for now)
            $product['productAttributes'] = $this->getProductAttributes($product['id']);

            // Attach discount data (this might need adjustment too)
            $this->attachDiscountData($product, $product['price']);
        }

        return $products;
    }

    public function findById(string $id): ?array
    {
        $query = "
            SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary,
                   c.name as category_name, s.name as subcategory_name, b.name as brand_name,
                   pg.name as group_name, pg.group_id
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN subcategories s ON p.subcategory_id = s.subcategory_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_groups pg ON p.group_id = pg.group_id
            WHERE p.id = ?";

        $stmt = $this->db->prepare($query);
        
        if (!$stmt) {
            error_log("findById prepare failed: " . $this->db->error);
            return null;
        }
        
        $stmt->bind_param('s', $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        if (!$result) {
            error_log("findById get_result failed: " . $stmt->error);
            return null;
        }
        
        $rows = $result->fetch_all(MYSQLI_ASSOC);

        if (!$rows) {
            error_log("findById: No rows found for product ID: $id");
            return null;
        }

        $base = $rows[0];
        $product = [
            'id' => $base['id'],
            'psku' => $base['psku'],
            'user_id' => $base['user_id'],
            'store_id' => $base['store_id'],
            'category_id' => $base['category_id'],
            'subcategory_id' => $base['subcategory_id'],
            'brand_id' => $base['brand_id'],
            'group_id' => $base['group_id'],
            'name' => $base['name'],
            'price' => $base['price'],
            'currency' => $base['currency'],
            'stock' => $base['stock'],
            'is_returnable' => $base['is_returnable'],
            'final_price' => $base['final_price'],
            'product_overview' => $base['product_overview'],
            'category_name' => $base['category_name'],
            'subcategory_name' => $base['subcategory_name'],
            'brand_name' => $base['brand_name'],
            'group_name' => $base['group_name'],
            'created_at' => $base['created_at'],
            'updated_at' => $base['updated_at'],
            'images' => [],
        ];

        foreach ($rows as $row) {
            if ($row['image_id']) {
                $product['images'][] = [
                    'id' => $row['image_id'],
                    'image_url' => $row['image_url'],
                    'is_primary' => (bool) $row['is_primary'],
                ];
            }
        }

        $product['productSpecifications'] = $this->specModel->findByProductId($id);

        // Get product attributes if part of a group
        if ($product['group_id']) {
            $product['groupAttributes'] = $this->groupModel->getGroupAttributes($product['group_id']);
            $product['productAttributes'] = $this->getProductAttributes($id);
            $product['groupProducts'] = $this->groupModel->getProductsInGroup($product['group_id']);
        } else {
            $product['groupAttributes'] = [];
            $product['productAttributes'] = [];
            $product['groupProducts'] = [];
        }

        $this->attachDiscountData($product, $product['price']);

        return $product;
    }

    public function getProductAttributes(string $productId): array
    {
        $query = 'SELECT * FROM product_attribute_values WHERE product_id = ? ORDER BY attribute_name';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }


    public function setProductAttributes(string $productId, array $attributes): bool
    {
        // Start transaction
        $this->db->begin_transaction();

        try {
            // Delete existing attributes
            $deleteQuery = 'DELETE FROM product_attribute_values WHERE product_id = ?';
            $deleteStmt = $this->db->prepare($deleteQuery);
            $deleteStmt->bind_param('s', $productId);
            $deleteStmt->execute();

            // Insert new attributes
            if (!empty($attributes)) {
                $insertQuery = 'INSERT INTO product_attribute_values (product_id, attribute_name, attribute_value) VALUES (?, ?, ?)';
                $insertStmt = $this->db->prepare($insertQuery);

                foreach ($attributes as $attribute) {
                    $insertStmt->bind_param('sss', $productId, $attribute['attribute_name'], $attribute['attribute_value']);
                    $insertStmt->execute();
                }
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Failed to set product attributes: " . $e->getMessage());
            return false;
        }
    }

    public function findByPsku(string $psku): ?array
    {
        $query = "
            SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary,
                   c.name as category_name, s.name as subcategory_name, b.name as brand_name,
                   pg.name as group_name, pg.group_id
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN subcategories s ON p.subcategory_id = s.subcategory_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            LEFT JOIN product_groups pg ON p.group_id = pg.group_id
            WHERE p.psku = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $psku);
        $rows = $this->fetchAssocAll($stmt);

        if (!$rows)
            return null;

        // Use the same logic as findById for consistency
        return $this->findById($rows[0]['id']);
    }

    private function generatePsku(string $productName): string
    {
        // Generate PSKU from product name
        $basePsku = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $productName));
        $basePsku = substr($basePsku, 0, 8); // Limit to 8 characters

        // Add random suffix to ensure uniqueness
        $suffix = strtoupper(substr(md5(uniqid()), 0, 4));

        return $basePsku . '-' . $suffix;
    }

    public function create(array $data, ?int $storeId = null): ?array
    {
        // Basic validation for required fields
        if (empty($data['name']) || !is_string($data['name'])) {
            error_log("Validation failed: name is required and must be a string");
            return null;
        }

        if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
            error_log("Validation failed: price must be a positive number");
            return null;
        }

        if (empty($data['currency']) || !is_string($data['currency'])) {
            error_log("Validation failed: currency is required and must be a string");
            return null;
        }

        // Clean up data - convert null values to appropriate defaults
        $cleanData = [
            'name' => trim($data['name']),
            'price' => (float) $data['price'],
            'currency' => trim($data['currency']),
            'psku' => isset($data['psku']) && $data['psku'] !== null ? trim($data['psku']) : null,
            'category_id' => isset($data['category_id']) && $data['category_id'] !== null ? (int) $data['category_id'] : null,
            'subcategory_id' => isset($data['subcategory_id']) && $data['subcategory_id'] !== null ? (int) $data['subcategory_id'] : null,
            'brand_id' => isset($data['brand_id']) && $data['brand_id'] !== null ? (int) $data['brand_id'] : null,
            'group_id' => isset($data['group_id']) && $data['group_id'] !== null ? trim($data['group_id']) : null,
            'stock' => isset($data['stock']) && $data['stock'] !== null ? (int) $data['stock'] : 0,
            'product_overview' => isset($data['product_overview']) && $data['product_overview'] !== null ? trim($data['product_overview']) : null,
            'is_returnable' => isset($data['is_returnable']) ? (bool) $data['is_returnable'] : false,
            'images' => isset($data['images']) ? $data['images'] : [],
            'productSpecifications' => isset($data['productSpecifications']) ? $data['productSpecifications'] : [],
            'productAttributes' => isset($data['productAttributes']) ? $data['productAttributes'] : [],
            'discount' => isset($data['discount']) ? $data['discount'] : null
        ];

        $query = 'INSERT INTO products (id, psku, user_id, store_id, category_id, subcategory_id, brand_id, group_id, name, price, currency, stock, product_overview, is_returnable, final_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $hash = generateHash();

        // Generate PSKU if not provided
        $psku = $cleanData['psku'] ?? $this->generatePsku($cleanData['name']);

        // If store session exists, set user_id to NULL and use store_id
        // Otherwise use regular user session
        if ($storeId !== null) {
            $userId = null; // Stores don't have user_id
        } elseif (isset($_SESSION['user']['id'])) {
            $userId = $_SESSION['user']['id'];
            $storeId = null;
        } else {
            error_log("No valid user or store session found");
            return null;
        }

        $finalPrice = $this->calculateFinalPrice($cleanData['price'], $cleanData['discount']);
        $isReturnable = (int) $cleanData['is_returnable'];

        $stmt->bind_param(
            'sssiiiissdiisid',
            $hash,
            $psku,
            $userId,
            $storeId,
            $cleanData['category_id'],
            $cleanData['subcategory_id'],
            $cleanData['brand_id'],
            $cleanData['group_id'],
            $cleanData['name'],
            $cleanData['price'],
            $cleanData['currency'],
            $cleanData['stock'],
            $cleanData['product_overview'],
            $isReturnable,
            $finalPrice
        );

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        if (!empty($cleanData['images'])) {
            $imageModel = new ProductImage($this->db);
            foreach ($cleanData['images'] as $img) {
                $imageModel->create($hash, $img['image_url'], $img['is_primary'] ?? false);
            }
        }

        if (!empty($cleanData['productSpecifications'])) {
            $specModel = new ProductSpecification($this->db);
            foreach ($cleanData['productSpecifications'] as $spec) {
                $specModel->create($hash, $spec['spec_name'], $spec['spec_value']);
            }
        }

        // Handle product attributes for PSKU system
        if (!empty($cleanData['productAttributes'])) {
            $this->setProductAttributes($hash, $cleanData['productAttributes']);
        }

        if (!empty($cleanData['discount'])) {
            $discountData = $cleanData['discount'];
            $discountData['product_id'] = $hash;
            $discountModel = new Discount($this->db);
            $discountModel->create($discountData);
        }

        $createdProduct = $this->findById($hash);
        
        if (!$createdProduct) {
            error_log("Product created with ID: $hash but findById returned null");
            error_log("Query might be failing. Check database state for product ID: $hash");
        }
        
        return $createdProduct;
    }

    public function update(string $id, array $data): ?array
    {
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, max: 500), false)
            ->key('price', v::floatVal()->positive(), false)
            ->key('currency', v::stringType()->notEmpty()->length(3, 4), false)
            ->key('product_overview', v::optional(v::stringType()), false)
            ->key('psku', v::optional(v::stringType()->length(1, 100)), false)
            ->key('category_id', v::optional(v::intVal()->positive()), false)
            ->key('subcategory_id', v::optional(v::intVal()->positive()), false)
            ->key('brand_id', v::optional(v::intVal()->positive()), false)
            ->key('group_id', v::optional(v::stringType()), false)
            ->key('stock', v::optional(v::intVal()->min(0)), false)
            ->key('is_returnable', v::optional(v::boolType()), false);
        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        error_log("Test" . json_encode($data['stock']));

        $fields = [];
        $types = '';
        $values = [];

        $nonDbFields = ['discount', 'images', 'productAttributes', 'productSpecifications', '__typename'];

        foreach ($data as $key => $value) {
            if (in_array($key, $nonDbFields))
                continue;

            // Handle null values for foreign keys
            if (in_array($key, ['category_id', 'subcategory_id', 'brand_id', 'group_id']) && $value === '') {
                $value = null;
            }

            if ($key === 'is_returnable') {
                $value = (bool) $value;
            }

            $fields[] = "$key = ?";
            if (is_int($value) || ($key === 'is_returnable' && is_bool($value))) {
                $types .= 'i';
                if (is_bool($value)) {
                    $value = $value ? 1 : 0;
                }
            } elseif (is_float($value)) {
                $types .= 'd';
            } else {
                $types .= 's';
            }

            $values[] = $value;
        }

        $shouldRecalculate = isset($data['price']) || isset($data['discount']);
        if ($shouldRecalculate) {
            $currentProduct = $this->findById($id);
            $price = $data['price'] ?? $currentProduct['price'];
            $discount = $data['discount'] ?? $currentProduct['discount'];
            $finalPrice = $this->calculateFinalPrice($data['price'], $data['discount'] ?? null);


            $fields[] = "final_price = ?";
            $types .= 'd';
            $values[] = $finalPrice;
        }

        if (empty($fields)) {
            error_log("No fields to update.");
            return null;
        }

        $query = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $types .= 's';
        $values[] = $id;

        $bind_names[] = $types;
        foreach ($values as $key => $value) {
            $bind_names[] = &$values[$key];
        }

        call_user_func_array([$stmt, 'bind_param'], $bind_names);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        if (!empty($data['discount'])) {
            $discountModel = new Discount($this->db);
            $existing = $discountModel->findByProductId($id);

            $discount = $data['discount'];
            unset($discount['__typename']);

            $discountData = [
                'type' => $discount['type'],
                'value' => $discount['value'],
                'starts_at' => $discount['starts_at'],
                'ends_at' => $discount['ends_at'],
                'product_id' => $id,
            ];

            if ($existing) {
                $stmt = $this->db->prepare("UPDATE discounts SET type = ?, value = ?, starts_at = ?, ends_at = ? WHERE product_id = ?");
                $stmt->bind_param(
                    'sdsss',
                    $discountData['type'],
                    $discountData['value'],
                    $discountData['starts_at'],
                    $discountData['ends_at'],
                    $id
                );
                $stmt->execute();
            } else {
                $discountModel->create($discountData);
            }
        }

        // Handle product attributes update
        if (isset($data['productAttributes'])) {
            $this->setProductAttributes($id, $data['productAttributes']);
        }

        return $this->findById($id);
    }


    public function delete(string $id): bool
    {
        // Start transaction
        $this->db->begin_transaction();

        try {
            // Delete from wishlist_items first (foreign key constraint)
            $stmt = $this->db->prepare('DELETE FROM wishlist_items WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }

            // Delete product images
            $stmt = $this->db->prepare('DELETE FROM product_images WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }

            // Delete product specifications
            $stmt = $this->db->prepare('DELETE FROM product_specifications WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }

            // Delete product attributes
            $stmt = $this->db->prepare('DELETE FROM product_attribute_values WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }

            // Delete discounts
            $stmt = $this->db->prepare('DELETE FROM discounts WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }

            // Delete product variants if they exist
            $stmt = $this->db->prepare('DELETE FROM product_variants WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }

            // Finally delete the product
            $stmt = $this->db->prepare('DELETE FROM products WHERE id = ?');
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->db->error);
            }

            $stmt->bind_param('s', $id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            $affectedRows = $stmt->affected_rows;

            // Commit transaction
            $this->db->commit();

            return $affectedRows > 0;
        } catch (Exception $e) {
            // Rollback on error
            $this->db->rollback();
            error_log("Product deletion failed: " . $e->getMessage());
            return false;
        }
    }
}
