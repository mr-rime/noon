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

    public function __construct(mysqli $db)
    {
        $this->db = $db;
        $this->discountModel = new Discount($db);
        $this->optionModel = new ProductOption($db);
        $this->specModel = new ProductSpecification($db);
    }

    private function calculateFinalPrice(float $price, ?array $discount): float
    {
        if (!$discount)
            return $price;

        if ($discount['type'] === 'percentage') {
            return max($price - ($price * $discount['value'] / 100), 0);
        }

        if ($discount['type'] === 'fixed') {
            return max($price - $discount['value'], 0);
        }

        return $price;
    }

    private function getDiscountPercentage(float $price, ?array $discount): ?float
    {
        if (!$discount)
            return null;

        if ($discount['type'] === 'percentage') {
            return $discount['value'];
        }

        if ($discount['type'] === 'fixed' && $price > 0) {
            return round(($discount['value'] / $price) * 100, 2);
        }

        return null;
    }

    public function attachDiscountData(array &$product, float $price): void
    {
        $discount = $this->discountModel->findByProductId($product['id']);

        $now = new DateTime();
        error_log("NOW: " . $now->format('Y-m-d H:i:s'));

        if ($discount) {
            $startsAt = isset($discount['starts_at']) ? new DateTime($discount['starts_at']) : null;
            $endsAt = isset($discount['ends_at']) ? new DateTime($discount['ends_at']) : null;

            error_log("STARTS_AT: " . ($startsAt?->format('Y-m-d H:i:s') ?? 'null'));
            error_log("ENDS_AT: " . ($endsAt?->format('Y-m-d H:i:s') ?? 'null'));

            $isActive = (!$startsAt || $now >= $startsAt) &&
                (!$endsAt || $now <= $endsAt);

            error_log("DISCOUNT ACTIVE? " . ($isActive ? 'yes' : 'no'));

            if (!$isActive)
                $discount = null;
        }

        $finalPrice = $this->calculateFinalPrice($price, $discount);
        $percentage = $this->getDiscountPercentage($price, $discount);

        $product['discount'] = $discount;
        $product['final_price'] = $finalPrice;
        $product['discount_percentage'] = $percentage;
    }

    public function findAll(
        int $userId,
        int $limit = 10,
        int $offset = 0,
        string $search = ''
    ): array {
        $params = [];
        $types = '';
        $where = '';
        $order = 'ORDER BY id';

        if (!empty(trim($search))) {
            $where = "
            WHERE name LIKE CONCAT('%', ?, '%') 
               OR product_overview LIKE CONCAT('%', ?, '%')";
            $order = "
            ORDER BY
                CASE
                    WHEN name = ? THEN 1
                    WHEN name LIKE CONCAT(?, '%') THEN 2
                    WHEN name LIKE CONCAT('%', ?, '%') THEN 3
                    WHEN product_overview LIKE CONCAT('%', ?, '%') THEN 4
                    ELSE 5
                END, id";
            $params = [$search, $search, $search, $search, $search, $search];
            $types = 'ssssss';
        }

        $query = "
        SELECT id FROM products
        $where
        $order
        LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= 'ii';

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $idResult = $stmt->get_result();

        $productIds = array_column($idResult->fetch_all(MYSQLI_ASSOC), 'id');
        if (empty($productIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
SELECT 
    p.*, 
    pi.id AS image_id, 
    pi.image_url, 
    pi.is_primary,
    CASE WHEN wi.product_id IS NOT NULL THEN 1 ELSE 0 END AS is_in_wishlist,
    w.id AS wishlist_id
FROM products p
LEFT JOIN product_images pi 
    ON p.id = pi.product_id
LEFT JOIN wishlist_items wi 
    ON wi.product_id = p.id
LEFT JOIN wishlists w 
    ON wi.wishlist_id = w.id
    AND w.user_id = ?
WHERE p.id IN ($placeholders)
ORDER BY p.id";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param(
            'i' . str_repeat('s', count($productIds)),
            $userId,
            ...$productIds
        );
        $stmt->execute();
        $result = $stmt->get_result();

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $pid = $row['id'];
            if (!isset($products[$pid])) {
                $products[$pid] = [
                    'id' => $pid,
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'currency' => $row['currency'],
                    'stock' => $row['stock'],
                    'product_overview' => $row['product_overview'],
                    'is_returnable' => $row['is_returnable'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                    'is_in_wishlist' => (bool) $row['is_in_wishlist'],
                    'wishlist_id' => $row['wishlist_id'] ?? null,
                    'images' => [],
                ];
            }

            if ($row['image_id']) {
                $products[$pid]['images'][] = [
                    'id' => $row['image_id'],
                    'image_url' => $row['image_url'],
                    'is_primary' => (bool) $row['is_primary'],
                ];
            }
        }

        // Step 4: Attach product options, specs, and discounts
        foreach ($products as $productId => &$product) {
            $product['productOptions'] = $this->optionModel->findByProductId($productId);
            $product['productSpecifications'] = $this->specModel->findByProductId($productId);
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
        $stmt->execute();
        $result = $stmt->get_result();

        $product = null;
        while ($row = $result->fetch_assoc()) {
            if (!$product['id']) {
                $product['id'] = $row['id'];
                $product['user_id'] = $row['user_id'];
                $product['category_id'] = $row['category_id'];
                $product['name'] = $row['name'];
                $product['price'] = $row['price'];
                $product['currency'] = $row['currency'];
                $product['stock'] = $row['stock'];
                $product['is_returnable'] = $row['is_returnable'];
                $product['product_overview'] = $row['product_overview'];
                $product['created_at'] = $row['created_at'];
                $product['updated_at'] = $row['updated_at'];
            }

            if ($row['image_id']) {
                $product['images'][] = [
                    'id' => $row['image_id'],
                    'image_url' => $row['image_url'],
                    'is_primary' => (bool) $row['is_primary'],
                ];
            }
        }
        if (!$product)
            return null;

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
