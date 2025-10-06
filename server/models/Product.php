<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . '/ProductImage.php';
require_once __DIR__ . '/ProductOption.php';
require_once __DIR__ . '/ProductSpecification.php';
require_once __DIR__ . '/Discount.php';
require_once __DIR__ . '/../utils/generateHash.php';

class Product
{
    private mysqli $db;
    private Discount $discountModel;
    private ProductOption $optionModel;
    private ProductSpecification $specModel;
    private ProductImage $imageModel;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->discountModel = new Discount($db);
        $this->optionModel = new ProductOption($db);
        $this->specModel = new ProductSpecification($db);
        $this->imageModel = new ProductImage($db);
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

        // Main fetch
        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
            SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary, $wishlistSelect
                   0 as dummy -- ensures trailing comma handled
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            $wishlistJoin
            WHERE p.id IN ($placeholders)
            ORDER BY p.id";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($wishlistTypes . str_repeat('i', count($productIds)), ...array_merge($wishlistParams, $productIds));
        $rows = $this->fetchAssocAll($stmt);

        // Group rows
        $products = [];
        foreach ($rows as $row) {
            $pid = $row['id'];
            $products[$pid] ??= [
                'id' => $pid,
                'name' => $row['name'],
                'price' => $row['price'],
                'currency' => $row['currency'],
                'stock' => $row['stock'],
                'product_overview' => $row['product_overview'],
                'is_returnable' => $row['is_returnable'],
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
            $product['productOptions'] = $this->optionModel->findByProductId($pid);
            $product['productSpecifications'] = $this->specModel->findByProductId($pid);
            $this->attachDiscountData($product, $product['price']);
        }

        return array_values($products);
    }

    public function findById(string $id): ?array
    {
        $query = "
            SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $id);
        $rows = $this->fetchAssocAll($stmt);

        if (!$rows)
            return null;

        $base = $rows[0];
        $product = [
            'id' => $base['id'],
            'user_id' => $base['user_id'],
            'category_id' => $base['category_id'],
            'name' => $base['name'],
            'price' => $base['price'],
            'currency' => $base['currency'],
            'stock' => $base['stock'],
            'is_returnable' => $base['is_returnable'],
            'product_overview' => $base['product_overview'],
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

        $product['productOptions'] = $this->optionModel->findByProductId($id);
        $product['productSpecifications'] = $this->specModel->findByProductId($id);
        $this->attachDiscountData($product, $product['price']);

        return $product;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 500))
            ->key('price', v::floatVal()->positive())
            ->key('currency', v::stringType()->notEmpty()->length(3, 4))
            ->key('product_overview', v::optional(v::stringType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $query = 'INSERT INTO products (id, user_id, name, price, currency, product_overview, is_returnable, final_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';


        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $hash = generateHash();
        $userId = $_SESSION['user']['id'];
        $productOverview = $data['product_overview'] ?? null;
        $isReturnable = isset($data['is_returnable']) ? (int) (bool) $data['is_returnable'] : 0;

        $finalPrice = $this->calculateFinalPrice($data['price'], $data['discount'] ?? null);


        $stmt->bind_param(
            'sisdssid',
            $hash,
            $userId,
            $data['name'],
            $data['price'],
            $data['currency'],
            $productOverview,
            $isReturnable,
            $finalPrice
        );

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        if (!empty($data['images'])) {
            $imageModel = new ProductImage($this->db);
            foreach ($data['images'] as $img) {
                $imageModel->create($hash, $img['image_url'], $img['is_primary'] ?? false);
            }
        }

        if (!empty($data['productOptions'])) {
            $optionModel = new ProductOption($this->db);
            foreach ($data['productOptions'] as $opt) {
                $optionModel->create($hash, $opt['name'], $opt['value'], $opt['image_url'] ?? null, $opt['type']);
            }
        }

        if (!empty($data['productSpecifications'])) {
            $specModel = new ProductSpecification($this->db);
            foreach ($data['productSpecifications'] as $spec) {
                $specModel->create($hash, $spec['spec_name'], $spec['spec_value']);
            }
        }

        if (!empty($data['discount'])) {
            $discountData = $data['discount'];
            $discountData['product_id'] = $hash;
            $discountModel = new Discount($this->db);
            $discountModel->create($discountData);
        }

        return $this->findById($hash);
    }

    public function update(string $id, array $data): ?array
    {
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, max: 500), false)
            ->key('price', v::floatVal()->positive(), false)
            ->key('currency', v::stringType()->notEmpty()->length(3, 4), false)
            ->key('product_overview', v::optional(v::stringType()), false)
            ->key('category_id', v::optional(v::stringType()->length(1, 21)), false)
            ->key('stock', v::optional(v::intVal()->min(0)), false)
            ->key('category_id', v::optional(v::stringType()->length(1, 21)), false)
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

        $nonDbFields = ['discount', 'images', 'productOptions', 'productSpecifications', '__typename'];

        foreach ($data as $key => $value) {
            if (in_array($key, $nonDbFields))
                continue;

            if ($key === 'category_id' && $value === '') {
                $value = null;
            }

            if ($key === 'is_returnable') {
                $value = (bool) $value;
            }

            $fields[] = "$key = ?";
            if (is_int($value)) {
                $types .= 'i';
            } elseif (is_float($value)) {
                $types .= 'd';
            } elseif (is_bool($value)) {
                $types .= 'i';
                $value = $value ? 1 : 0;
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


        return $this->findById($id);
    }


    public function delete(string $id): bool
    {
        $query = 'DELETE FROM products WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $id);
        return $stmt->execute() && $stmt->affected_rows > 0;
    }
}
