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

    public function __construct(mysqli $db)
    {
        $this->db = $db;
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

    private function attachDiscountData(array &$product, float $price): void
    {
        $discountModel = new Discount($this->db);
        $discount = $discountModel->findByProductId($product['id']);

        $now = new DateTime();
        if ($discount) {
            $startsAt = isset($discount['starts_at']) ? new DateTime($discount['starts_at']) : null;
            $endsAt = isset($discount['ends_at']) ? new DateTime($discount['ends_at']) : null;

            $isActive = (!$startsAt || $now >= $startsAt) &&
                (!$endsAt || $now <= $endsAt);

            if (!$isActive) {
                $discount = null;
            }
        }

        $finalPrice = $this->calculateFinalPrice($price, $discount);
        $percentage = $this->getDiscountPercentage($price, $discount);

        error_log("discont here " . json_encode($discount));
        $product['discount'] = $discount;
        $product['final_price'] = $finalPrice;
        $product['discount_percentage'] = $percentage;
    }

    public function findAll(int $limit = 10, int $offset = 0, string $search = ''): array
    {
        $baseQuery = "SELECT id FROM products";
        $params = [];
        $types = '';

        // Add search condition if provided
        if (!empty(trim($search))) {
            $baseQuery .= "
            WHERE name LIKE CONCAT('%', ?, '%') 
               OR product_overview LIKE CONCAT('%', ?, '%')
            ORDER BY
                CASE
                    WHEN name = ? THEN 1
                    WHEN name LIKE CONCAT(?, '%') THEN 2
                    WHEN name LIKE CONCAT('%', ?, '%') THEN 3
                    WHEN product_overview LIKE CONCAT('%', ?, '%') THEN 4
                    ELSE 5
                END,
                id
            LIMIT ? OFFSET ?
        ";
            $params = [$search, $search, $search, $search, $search, $search, $limit, $offset];
            $types = 'ssssssii';
        } else {
            $baseQuery .= " ORDER BY id LIMIT ? OFFSET ?";
            $params = [$limit, $offset];
            $types = 'ii';
        }

        // Get product IDs
        $stmt = $this->db->prepare($baseQuery);
        if (!empty($types)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $idResult = $stmt->get_result();

        $productIds = [];
        while ($row = $idResult->fetch_assoc()) {
            $productIds[] = $row['id'];
        }

        if (empty($productIds)) {
            return [];
        }

        // Fetch complete product data with images
        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
        SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id IN ($placeholders)
        ORDER BY p.id
    ";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param(str_repeat('i', count($productIds)), ...$productIds);
        $stmt->execute();
        $result = $stmt->get_result();

        $products = [];
        while ($row = $result->fetch_assoc()) {
            $productId = $row['id'];
            if (!isset($products[$productId])) {
                $products[$productId] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'currency' => $row['currency'],
                    'stock' => $row['stock'],
                    'product_overview' => $row['product_overview'],
                    'is_returnable' => $row['is_returnable'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                    'images' => [],
                ];
            }

            if ($row['image_id'] !== null) {
                $products[$productId]['images'][] = [
                    'id' => $row['image_id'],
                    'image_url' => $row['image_url'],
                    'is_primary' => (bool) $row['is_primary'],
                ];
            }
        }

        // Attach additional data
        $optionModel = new ProductOption($this->db);
        $specModel = new ProductSpecification($this->db);

        foreach ($products as $productId => &$product) {
            $product['productOptions'] = $optionModel->findByProductId($productId);
            $product['productSpecifications'] = $specModel->findByProductId($productId);
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
            WHERE p.id = ?
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $product = null;
        while ($row = $result->fetch_assoc()) {
            if ($product === null) {
                $product = [
                    'id' => $row['id'],
                    'user_id' => $row['user_id'],
                    'category_id' => $row['category_id'],
                    'name' => $row['name'],
                    'price' => $row['price'],
                    'currency' => $row['currency'],
                    'stock' => $row['stock'],
                    'is_returnable' => $row['is_returnable'],
                    'product_overview' => $row['product_overview'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                    'images' => [],
                ];
            }

            if ($row['image_id'] !== null) {
                $product['images'][] = [
                    'id' => $row['image_id'],
                    'image_url' => $row['image_url'],
                    'is_primary' => (bool) $row['is_primary'],
                ];
            }
        }

        if (!$product)
            return null;

        $optionModel = new ProductOption($this->db);
        $specModel = new ProductSpecification($this->db);
        $product['productOptions'] = $optionModel->findByProductId($id);
        $product['productSpecifications'] = $specModel->findByProductId($id);
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

        $query = 'INSERT INTO products (id, user_id, name, price, currency, product_overview, is_returnable) VALUES (?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $hash = generateHash();
        $userId = $_SESSION['user']['id'];
        $productOverview = $data['product_overview'] ?? null;
        $isReturnable = isset($data['is_returnable']) ? (int) (bool) $data['is_returnable'] : 0;

        $stmt->bind_param(
            'sisdssi',
            $hash,
            $userId,
            $data['name'],
            $data['price'],
            $data['currency'],
            $productOverview,
            $isReturnable
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
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 100), false)
            ->key('price', v::floatVal()->positive(), false)
            ->key('currency', v::stringType()->notEmpty()->length(3, 4), false)
            ->key('product_overview', v::optional(v::stringType()), false)
            ->key('stock', v::optional(v::intVal()->min(0)), false)
            ->key('category_id', v::optional(v::stringType()->length(1, 21)), false)
            ->key('is_returnable', v::optional(v::boolType()), false);

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

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

        // Discount handling
        if (!empty($data['discount'])) {
            $discountModel = new Discount($this->db);
            $existing = $discountModel->findById($id);

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
