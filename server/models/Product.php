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
    private Brand $brandModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->discountModel = new Discount($db);
        $this->specModel = new ProductSpecification($db);
        $this->imageModel = new ProductImage($db);
        $this->groupModel = new ProductGroup($db);
        $this->categoryModel = new Category($db);
        $this->brandModel = new Brand($db);
    }



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

    private function generateSlug(string $name): string
    {

        return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
    }



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

        $where = "WHERE name LIKE CONCAT('%', ?, '%') OR product_overview LIKE CONCAT('%', ?, '%') OR psku LIKE CONCAT('%', ?, '%')";
        $order = "
            ORDER BY CASE
                WHEN psku = ? THEN 1
                WHEN name = ? THEN 2
                WHEN psku LIKE CONCAT(?, '%') THEN 3
                WHEN name LIKE CONCAT(?, '%') THEN 4
                WHEN name LIKE CONCAT('%', ?, '%') THEN 5
                WHEN product_overview LIKE CONCAT('%', ?, '%') THEN 6
                ELSE 7
            END, id";
        $params = array_fill(0, 9, $search);
        $types = 'sssssssss';

        return [$where, $order, $params, $types];
    }

    private function buildWhereWithFilters(string $search, ?string $categoryId, ?array $categories, ?array $brands, ?float $minPrice, ?float $maxPrice, ?float $minRating): array
    {
        $conditions = [];
        $params = [];
        $types = '';


        if (!empty(trim($search))) {
            $conditions[] = "(name LIKE CONCAT('%', ?, '%') OR product_overview LIKE CONCAT('%', ?, '%') OR psku LIKE CONCAT('%', ?, '%'))";
            $params = array_merge($params, [$search, $search, $search]);
            $types .= 'sss';
        }



        if (!empty($categories) && is_array($categories)) {

            $categoryModel = new Category($this->db);
            $allCategoryIds = [];

            foreach ($categories as $catId) {
                $descendantIds = $categoryModel->getAllDescendantIds($catId);
                $allCategoryIds = array_merge($allCategoryIds, $descendantIds);
            }

            $allCategoryIds = array_unique($allCategoryIds);

            if (!empty($allCategoryIds)) {
                $placeholders = implode(',', array_fill(0, count($allCategoryIds), '?'));
                $conditions[] = "category_id IN ($placeholders)";
                $params = array_merge($params, $allCategoryIds);
                $types .= str_repeat('s', count($allCategoryIds));
            }
        } elseif ($categoryId !== null) {

            $categoryModel = new Category($this->db);
            $descendantIds = $categoryModel->getAllDescendantIds($categoryId);

            if (!empty($descendantIds)) {
                $placeholders = implode(',', array_fill(0, count($descendantIds), '?'));
                $conditions[] = "category_id IN ($placeholders)";
                $params = array_merge($params, $descendantIds);
                $types .= str_repeat('s', count($descendantIds));
            } else {
                $conditions[] = "category_id = ?";
                $params[] = $categoryId;
                $types .= 's';
            }
        }


        if (!empty($brands)) {
            $placeholders = implode(',', array_fill(0, count($brands), '?'));
            $conditions[] = "brand_id IN ($placeholders)";
            $params = array_merge($params, $brands);
            $types .= str_repeat('i', count($brands));
        }


        if ($minPrice !== null) {
            $conditions[] = "price >= ?";
            $params[] = $minPrice;
            $types .= 'd';
        }
        if ($maxPrice !== null) {
            $conditions[] = "price <= ?";
            $params[] = $maxPrice;
            $types .= 'd';
        }








        $where = empty($conditions) ? '' : 'WHERE ' . implode(' AND ', $conditions);

        $order = !empty(trim($search)) ? "
            ORDER BY CASE
                WHEN psku = ? THEN 1
                WHEN name = ? THEN 2
                WHEN psku LIKE CONCAT(?, '%') THEN 3
                WHEN name LIKE CONCAT(?, '%') THEN 4
                WHEN name LIKE CONCAT('%', ?, '%') THEN 5
                WHEN product_overview LIKE CONCAT('%', ?, '%') THEN 6
                ELSE 7
            END, id" : 'ORDER BY id';

        if (!empty(trim($search))) {
            $params = array_merge($params, array_fill(0, 6, $search));
            $types .= 'ssssss';
        }

        return [$where, $order, $params, $types];
    }



    public function findAll(?int $userId, int $limit = 10, int $offset = 0, string $search = '', bool $publicOnly = false, ?string $categoryId = null, ?array $categories = null, ?array $brands = null, ?float $minPrice = null, ?float $maxPrice = null, ?float $minRating = null): array
    {
        [$where, $order, $params, $types] = $this->buildWhereWithFilters($search, $categoryId, $categories, $brands, $minPrice, $maxPrice, $minRating);


        if ($publicOnly) {
            if (trim($where) === '') {
                $where = "WHERE is_public = 1";
            } else {
                $where = preg_replace('/^\s*WHERE\s*/i', 'WHERE ', $where);
                $where .= " AND is_public = 1";
            }
        }


        $query = "SELECT id FROM products $where $order LIMIT ? OFFSET ?";
        $params = [...$params, $limit, $offset];
        $types .= 'ii';

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($types, ...$params);
        $productIds = array_column($this->fetchAssocAll($stmt), 'id');

        if (!$productIds)
            return [];


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


        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
    SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary, $wishlistSelect
           c.name as category_name, s.name as subcategory_name, b.name as brand_name,
           pg.name as group_name, pg.group_id,
           0 as dummy
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN categories_nested c ON p.category_id = c.category_id
    LEFT JOIN subcategories s ON p.subcategory_id = s.subcategory_id
    LEFT JOIN brands b ON p.brand_id = b.brand_id
    LEFT JOIN product_groups pg ON p.group_id = pg.group_id
    $wishlistJoin
    WHERE p.id IN ($placeholders)"
            . ($publicOnly ? " AND p.is_public = 1" : "") . "
    ORDER BY p.id";



        $stmt = $this->db->prepare($query);
        $params = array_merge($wishlistParams, $productIds);
        $stmt->bind_param($wishlistTypes . str_repeat('i', count($productIds)), ...$params);
        $rows = $this->fetchAssocAll($stmt);


        $products = [];
        foreach ($rows as $row) {
            $pid = $row['id'];
            $products[$pid] ??= [
                'id' => $pid,
                'psku' => $row['psku'],
                'name' => $row['name'],
                'slug' => $this->generateSlug($row['name']),
                'price' => $row['price'],
                'currency' => $row['currency'],
                'stock' => $row['stock'],
                'product_overview' => $row['product_overview'],
                'is_returnable' => $row['is_returnable'],
                'is_public' => $row['is_public'] ?? 0,
                'final_price' => $row['final_price'],
                'category_id' => $row['category_id'],
                'brand_id' => $row['brand_id'],
                'group_id' => $row['group_id'],
                'category_name' => $row['category_name'],
                'subcategory_name' => $row['subcategory_name'],
                'brand_name' => $row['brand_name'],
                'group_name' => $row['group_name'],
                'brand' => [
                    'name' => $row['brand_name']
                ],
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


        foreach ($products as $pid => &$product) {
            $product['productSpecifications'] = $this->specModel->findByProductId($pid);


            $ratingData = $this->getProductRatingData($pid);
            $product['rating'] = $ratingData['rating'];
            $product['review_count'] = $ratingData['review_count'];

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

    public function getTotalCount(string $search = '', bool $publicOnly = false, ?string $categoryId = null, ?array $categories = null, ?array $brands = null, ?float $minPrice = null, ?float $maxPrice = null, ?float $minRating = null): int
    {
        [$where, $order, $params, $types] = $this->buildWhereWithFilters($search, $categoryId, $categories, $brands, $minPrice, $maxPrice, $minRating);


        if ($publicOnly) {
            if (empty($where)) {
                $where = "WHERE is_public = 1";
            } else {
                $where .= " AND is_public = 1";
            }
        }

        $query = "SELECT COUNT(*) as total FROM products $where";
        $stmt = $this->db->prepare($query);

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $result = $this->fetchAssocAll($stmt);
        return (int) ($result[0]['total'] ?? 0);
    }

    public function findRelatedProducts(string $productId, ?string $categoryId, ?int $brandId, int $limit = 8): array
    {

        $currentProduct = $this->findById($productId);
        $excludeGroupId = $currentProduct['group_id'] ?? null;

        $query = "
            SELECT DISTINCT p.id, p.name, p.price, p.currency, p.stock, p.product_overview, p.category_id,
                   c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.id != ? AND p.is_public = 1";

        $params = [$productId];
        $types = 's';


        if ($categoryId) {
            $query .= " AND p.category_id = ?";
            $params[] = $categoryId;
            $types .= 's';
        }

        $query .= " ORDER BY 
            CASE 
                WHEN p.category_id = ? THEN 1
                ELSE 2
            END, p.name ASC
            LIMIT ?";


        $params[] = $categoryId;
        $params[] = $limit;
        $types .= 'si';

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


        foreach ($products as $pid => &$product) {

            $product['psku'] = null;
            $product['brand_id'] = null;
            $product['group_id'] = null;
            $product['subcategory_name'] = null;
            $product['brand_name'] = null;
            $product['group_name'] = null;
            $product['is_public'] = false;
            $product['final_price'] = $product['price'];
            $product['discount_percentage'] = 0;
            $product['created_at'] = $product['created_at'] ?? null;
            $product['updated_at'] = $product['updated_at'] ?? null;

            $product['productSpecifications'] = $this->specModel->findByProductId($product['id']);


            $ratingData = $this->getProductRatingData($product['id']);
            $product['rating'] = $ratingData['rating'];
            $product['review_count'] = $ratingData['review_count'];

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


            $product['productAttributes'] = $this->getProductAttributes($product['id']);


            $this->attachDiscountData($product, $product['price']);
        }

        return $products;
    }

    public function findById(string $id, bool $publicOnly = false): ?array
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
            WHERE p.id = ?
        ";

        if ($publicOnly) {
            $query .= " AND p.is_public = 1";
        }


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
            'brand_id' => $base['brand_id'],
            'group_id' => $base['group_id'],
            'name' => $base['name'],
            'price' => $base['price'],
            'currency' => $base['currency'],
            'stock' => $base['stock'],
            'is_returnable' => $base['is_returnable'],
            'is_public' => $base['is_public'] ?? 0,
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


        $ratingData = $this->getProductRatingData($id);
        $product['rating'] = $ratingData['rating'];
        $product['review_count'] = $ratingData['review_count'];

        if ($product['group_id']) {
            $product['groupAttributes'] = $this->groupModel->getGroupAttributes($product['group_id']);
            $product['productAttributes'] = $this->getProductAttributes($id);
            $product['groupProducts'] = $this->groupModel->getProductsInGroup($product['group_id'], $publicOnly);
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

        $this->db->begin_transaction();

        try {

            $deleteQuery = 'DELETE FROM product_attribute_values WHERE product_id = ?';
            $deleteStmt = $this->db->prepare($deleteQuery);
            $deleteStmt->bind_param('s', $productId);
            $deleteStmt->execute();


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

    public function findByBrandId(int $brandId): array
    {
        $query = 'SELECT id FROM products WHERE brand_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('i', $brandId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findByPsku(string $psku, bool $publicOnly = false): ?array
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

        if ($publicOnly) {
            $query .= " AND p.is_public = 1";
        }

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $psku);
        $rows = $this->fetchAssocAll($stmt);

        if (!$rows)
            return null;


        return $this->findById($rows[0]['id'], $publicOnly);
    }

    private function generatePsku(string $productName): string
    {

        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $randomString = '';

        for ($i = 0; $i < 15; $i++) {
            $randomString .= $characters[random_int(0, strlen($characters) - 1)];
        }


        $number = str_pad(random_int(0, 999), 3, '0', STR_PAD_LEFT);

        return 'PSKU_' . $randomString . $number;
    }

    public function create(array $data, ?int $storeId = null): ?array
    {

        if (empty($data['name']) || !is_string($data['name'])) {
            error_log("Validation failed: name is required and must be a string");
            return null;
        }

        if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
            error_log("Validation failed: price must be a positive number");
            return null;
        }

        if (empty($data['currency']) || !is_string($data['currency']) || $data['currency'] === '0') {
            error_log("Validation failed: currency is required and must be a valid string (got: " . json_encode($data['currency']) . ")");
            return null;
        }


        $cleanData = [
            'name' => trim($data['name']),
            'price' => (float) $data['price'],
            'currency' => trim($data['currency']),
            'psku' => isset($data['psku']) && $data['psku'] !== null ? trim($data['psku']) : null,
            'category_id' => isset($data['category_id']) && $data['category_id'] !== null ? $data['category_id'] : null,
            'subcategory_id' => isset($data['subcategory_id']) && $data['subcategory_id'] !== null ? $data['subcategory_id'] : null,
            'brand_id' => isset($data['brand_id']) && $data['brand_id'] !== null ? (int) $data['brand_id'] : null,
            'group_id' => isset($data['group_id']) && $data['group_id'] !== null ? trim($data['group_id']) : null,
            'stock' => isset($data['stock']) && $data['stock'] !== null ? (int) $data['stock'] : 0,
            'product_overview' => isset($data['product_overview']) && $data['product_overview'] !== null ? trim($data['product_overview']) : null,
            'is_returnable' => isset($data['is_returnable']) ? (bool) $data['is_returnable'] : false,
            'is_public' => isset($data['is_public']) ? (bool) $data['is_public'] : false,
            'images' => isset($data['images']) ? $data['images'] : [],
            'productSpecifications' => isset($data['productSpecifications']) ? $data['productSpecifications'] : [],
            'productAttributes' => isset($data['productAttributes']) ? $data['productAttributes'] : [],
            'discount' => isset($data['discount']) ? $data['discount'] : null
        ];

        $query = 'INSERT INTO products (id, psku, user_id, store_id, category_id, subcategory_id, brand_id, group_id, name, price, currency, stock, product_overview, is_returnable, is_public, final_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $hash = generateHash();


        $psku = $cleanData['psku'] ?? $this->generatePsku($cleanData['name']);


        if (!empty($psku)) {
            $existingProduct = $this->findByPsku($psku);
            if ($existingProduct) {
                error_log("PSKU validation failed: PSKU '$psku' already exists for product ID: " . $existingProduct['id']);
                return null;
            }
        }



        if ($storeId !== null) {
            $userId = 0;
        } elseif (isset($_SESSION['user']['id'])) {
            $userId = $_SESSION['user']['id'];
            $storeId = null;
        } else {
            error_log("No valid user or store session found");
            return null;
        }

        $finalPrice = $this->calculateFinalPrice($cleanData['price'], $cleanData['discount']);
        $isReturnable = (int) $cleanData['is_returnable'];
        $isPublic = (int) $cleanData['is_public'];

        $stmt->bind_param(
            'ssiisssdsisiiiid',
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
            $isPublic,
            $finalPrice
        );

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            error_log("Product data being inserted: " . json_encode($cleanData));
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


            $debugQuery = "SELECT * FROM products WHERE id = ?";
            $debugStmt = $this->db->prepare($debugQuery);
            if ($debugStmt) {
                $debugStmt->bind_param('s', $hash);
                $debugStmt->execute();
                $debugResult = $debugStmt->get_result();
                $debugProduct = $debugResult->fetch_assoc();
                if ($debugProduct) {
                    error_log("Direct query found product: " . json_encode($debugProduct));
                } else {
                    error_log("Direct query also returned no product for ID: $hash");
                }
            }
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
            ->key('category_id', v::optional(v::stringType()), false)
            ->key('subcategory_id', v::optional(v::stringType()), false)
            ->key('brand_id', v::optional(v::intVal()->positive()), false)
            ->key('group_id', v::optional(v::stringType()), false)
            ->key('stock', v::optional(v::intVal()->min(0)), false)
            ->key('is_returnable', v::optional(v::boolType()), false)
            ->key('is_public', v::optional(v::boolType()), false);
        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }


        if (isset($data['psku']) && !empty($data['psku'])) {
            $existingProduct = $this->findByPsku($data['psku']);
            if ($existingProduct && $existingProduct['id'] !== $id) {
                error_log("PSKU validation failed: PSKU '{$data['psku']}' already exists for product ID: " . $existingProduct['id']);
                return null;
            }
        }

        $fields = [];
        $types = '';
        $values = [];

        $nonDbFields = ['discount', 'images', 'productAttributes', 'productSpecifications', '__typename'];

        foreach ($data as $key => $value) {
            if (in_array($key, $nonDbFields))
                continue;


            if (in_array($key, ['category_id', 'brand_id', 'group_id']) && $value === '') {
                $value = null;
            }

            if ($key === 'is_returnable' || $key === 'is_public') {
                $value = (bool) $value;
            }

            $fields[] = "$key = ?";
            if (is_int($value) || (($key === 'is_returnable' || $key === 'is_public') && is_bool($value))) {
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


        if (isset($data['productAttributes'])) {
            $this->setProductAttributes($id, $data['productAttributes']);
        }

        return $this->findById($id);
    }


    public function delete(string $id): bool
    {

        $this->db->begin_transaction();

        try {

            $stmt = $this->db->prepare('DELETE FROM wishlist_items WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }


            $stmt = $this->db->prepare('DELETE FROM product_images WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }


            $stmt = $this->db->prepare('DELETE FROM product_specifications WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }


            $stmt = $this->db->prepare('DELETE FROM product_attribute_values WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }


            $stmt = $this->db->prepare('DELETE FROM discounts WHERE product_id = ?');
            if ($stmt) {
                $stmt->bind_param('s', $id);
                $stmt->execute();
            }





            $stmt = $this->db->prepare('DELETE FROM products WHERE id = ?');
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->db->error);
            }

            $stmt->bind_param('s', $id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            $affectedRows = $stmt->affected_rows;


            $this->db->commit();

            return $affectedRows > 0;
        } catch (Exception $e) {

            $this->db->rollback();
            error_log("Product deletion failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get product rating data (average rating and review count)
     */
    private function getProductRatingData(string $productId): array
    {
        try {

            $countQuery = "SELECT COUNT(*) as total FROM reviews WHERE product_id = ?";
            $countStmt = $this->db->prepare($countQuery);
            $countStmt->bind_param('s', $productId);
            $countStmt->execute();
            $countResult = $countStmt->get_result()->fetch_assoc();
            $reviewCount = (int) ($countResult['total'] ?? 0);


            $avgQuery = "SELECT AVG(CAST(rating AS DECIMAL(3,2))) as avg_rating FROM reviews WHERE product_id = ?";
            $avgStmt = $this->db->prepare($avgQuery);
            $avgStmt->bind_param('s', $productId);
            $avgStmt->execute();
            $avgResult = $avgStmt->get_result()->fetch_assoc();
            $averageRating = $avgResult['avg_rating'] ? round((float) $avgResult['avg_rating'], 1) : 0.0;

            return [
                'rating' => $averageRating,
                'review_count' => $reviewCount
            ];
        } catch (Exception $e) {
            error_log("Error getting product rating data: " . $e->getMessage());
            return [
                'rating' => 0.0,
                'review_count' => 0
            ];
        }
    }
}
