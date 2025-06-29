<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class ProductSpecification
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findByProductId(string $productId): array
    {
        $query = 'SELECT * FROM product_specifications WHERE product_id = ?';
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

    public function create(string $productId, string $specName, string $specValue): ?array
    {
        $validator = v::stringType()->notEmpty();
        try {
            $validator->assert($productId);
            $validator->assert($specName);
            $validator->assert($specValue);
        } catch (ValidationException $err) {
            error_log("Validation failed: " . $err->getMessage());
            return null;
        }

        $query = 'INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES (?, ?, ?)';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param('sss', $productId, $specName, $specValue);
        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            return $this->findById($id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM product_specifications WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function update(int $id, array $data): ?array
    {
        $fields = ['spec_name', 'spec_value'];
        $set = [];
        $params = [];
        $types = '';

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $set[] = "$field = ?";
                $params[] = $data[$field];
                $types .= 's';
            }
        }
        if (empty($set)) {
            return $this->findById($id);
        }
        $params[] = $id;
        $types .= 'i';

        $query = 'UPDATE product_specifications SET ' . implode(', ', $set) . ' WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            return $this->findById($id);
        }
        error_log("Execute failed: " . $stmt->error);
        return null;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM product_specifications WHERE id = ?';
        $stmt = $this->db->prepare($query);
        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }

    public function replaceForProduct(string $productId, array $specs): void
    {
        $this->db->query("DELETE FROM product_specifications WHERE product_id = '$productId'");
        $stmt = $this->db->prepare("INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES (?, ?, ?)");
        foreach ($specs as $spec) {
            $stmt->bind_param('sss', $productId, $spec['spec_name'], $spec['spec_value']);
            $stmt->execute();
        }
    }

}
