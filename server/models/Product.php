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

        // $product['discount'] = $discount;
        $product['final_price'] = $finalPrice;
        $product['discount_percentage'] = $percentage;
    }




    public function findAll(int $limit = 10, int $offset = 0): array
    {
        $stmt = $this->db->prepare("SELECT id FROM products ORDER BY id LIMIT ? OFFSET ?");
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $idResult = $stmt->get_result();

        $productIds = [];
        while ($row = $idResult->fetch_assoc()) {
            $productIds[] = $row['id'];
        }

        if (empty($productIds))
            return [];

        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $types = str_repeat('s', count($productIds));

        $query = "
            SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id IN ($placeholders)
            ORDER BY p.id
        ";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param($types, ...$productIds);
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
                $optionModel->create($hash, $opt['name'], $opt['value'], $opt['image_url'] ?? null, $opt['type'], $opt['linked_product_id'] ?? null);
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
        $validator = v::keySet(
            v::key('user_id', v::intVal()->positive(), false),
            v::key('name', v::stringType()->notEmpty()->length(1, 100), false),
            v::key('price', v::floatVal()->positive(), false),
            v::key('currency', v::stringType()->notEmpty()->length(3, 4), false),
            v::key('product_overview', v::optional(v::stringType()), false)
        );

        try {
            $validator->assert($data);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $fields = [];
        $types = '';
        $values = [];

        foreach ($data as $key => $value) {
            if ($key === 'discount')
                continue;
            $fields[] = "$key = ?";
            $types .= is_int($value) ? 'i' : (is_float($value) ? 'd' : 's');
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

        if (!empty($data['discount'])) {
            $discountModel = new Discount($this->db);
            $existing = $discountModel->findById($id);

            if ($existing) {
                $stmt = $this->db->prepare("UPDATE discounts SET type = ?, value = ?, starts_at = ?, ends_at = ? WHERE product_id = ?");
                $stmt->bind_param(
                    'sdsss',
                    $data['discount']['type'],
                    $data['discount']['value'],
                    $data['discount']['starts_at'],
                    $data['discount']['ends_at'],
                    $id
                );
                $stmt->execute();
            } else {
                $discountData = $data['discount'];
                $discountData['product_id'] = $id;
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
