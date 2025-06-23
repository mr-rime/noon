<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

require_once __DIR__ . '/ProductImage.php';
require_once __DIR__ . '/ProductOption.php';
require_once __DIR__ . '/ProductSpecification.php';

class Product
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(int $limit = 10, int $offset = 0): array
    {
        $stmt = $this->db->prepare("
        SELECT p.*, pi.id AS image_id, pi.image_url, pi.is_primary
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        ORDER BY p.id
        LIMIT ? OFFSET ?
    ");

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!$result) {
            error_log("Query failed: " . $this->db->error);
            return [];
        }

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
        }

        return array_values($products);
    }



    public function findById(string $id): ?array
    {
        $query = "
        SELECT p.*, 
               pi.id AS image_id, 
               pi.image_url, 
               pi.is_primary
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
    ";

        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $id);

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            $stmt->close();
            return null;
        }

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

        $stmt->close();

        if ($product !== null) {
            $optionModel = new ProductOption($this->db);
            $specModel = new ProductSpecification($this->db);

            $product['productOptions'] = $optionModel->findByProductId($id);
            $product['productSpecifications'] = $specModel->findByProductId($id);
        }

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
            error_log("Validation failed looooool: " . $err->getMessage());
            return null;
        }

        $query = 'INSERT INTO products (id, user_id, name, price, currency, product_overview) VALUES (?, ?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $hash = generateHash();
        $userId = $_SESSION['user']['id'];
        $productOverview = $data['product_overview'] ?? null;

        $stmt->bind_param(
            'sisdss',
            $hash,
            $userId,
            $data['name'],
            $data['price'],
            $data['currency'],
            $productOverview
        );

        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }

        if (!empty($data['images']) && is_array($data['images'])) {
            $imageModel = new ProductImage($this->db);
            foreach ($data['images'] as $image) {
                $imageUrl = $image['image_url'] ?? null;
                $isPrimary = $image['is_primary'] ?? false;

                if ($imageUrl) {
                    $imageModel->create($hash, $imageUrl, $isPrimary);
                }
            }
        }

        if (!empty($data['productOptions']) && is_array($data['productOptions'])) {
            $optionModel = new ProductOption($this->db);
            foreach ($data['productOptions'] as $option) {
                $name = $option['name'] ?? null;
                $value = $option['value'] ?? null;
                $image_url = $option['image_url'] ?? null;
                $type = $option['type'] ?? null;

                if ($name && $value && $type && in_array($type, ['text', 'image'])) {
                    $optionModel->create($hash, $name, $value, $image_url, $type);
                }
            }
        }

        if (!empty($data['productSpecifications']) && is_array($data['productSpecifications'])) {
            $specModel = new ProductSpecification($this->db);
            foreach ($data['productSpecifications'] as $spec) {
                $specName = $spec['spec_name'] ?? null;
                $specValue = $spec['spec_value'] ?? null;

                if ($specName && $specValue) {
                    $specModel->create($hash, $specName, $specValue);
                }
            }
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
            $fields[] = "$key = ?";
            if ($key === 'user_id') {
                $types .= 'i';
            } elseif ($key === 'price') {
                $types .= 'd';
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

        if ($stmt->execute()) {
            return $this->findById($id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
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

        if ($stmt->execute()) {
            return $stmt->affected_rows > 0;
        } else {
            error_log("Execute failed: " . $stmt->error);
            return false;
        }
    }
}
