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
        $stmt = $this->db->prepare('SELECT * FROM product_specifications WHERE product_id = ?');
        if (!$stmt) {
            error_log("Prepare failed (findByProductId): " . $this->db->error);
            return [];
        }

        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create(string $productId, string $specName, string $specValue): ?array
    {
        try {
            v::stringType()->notEmpty()->assert($productId);
            v::stringType()->notEmpty()->assert($specName);
            v::stringType()->notEmpty()->assert($specValue);
        } catch (ValidationException $err) {
            error_log("Validation failed (create): " . $err->getMessage());
            return null;
        }

        $stmt = $this->db->prepare('
            INSERT INTO product_specifications (product_id, spec_name, spec_value)
            VALUES (?, ?, ?)
        ');

        if (!$stmt) {
            error_log("Prepare failed (create): " . $this->db->error);
            return null;
        }

        $stmt->bind_param('sss', $productId, $specName, $specValue);

        if ($stmt->execute()) {
            return $this->findById($stmt->insert_id);
        } else {
            error_log("Execute failed (create): " . $stmt->error);
            return null;
        }
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM product_specifications WHERE id = ? LIMIT 1');
        if (!$stmt) {
            error_log("Prepare failed (findById): " . $this->db->error);
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
            if (!empty($data[$field])) {
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
            error_log("Prepare failed (update): " . $this->db->error);
            return null;
        }

        $stmt->bind_param($types, ...$params);

        if ($stmt->execute()) {
            return $this->findById($id);
        }

        error_log("Execute failed (update): " . $stmt->error);
        return null;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM product_specifications WHERE id = ?');
        if (!$stmt) {
            error_log("Prepare failed (delete): " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }

    public function replaceForProduct(string $productId, array $specs): void
    {

        $delStmt = $this->db->prepare("DELETE FROM product_specifications WHERE product_id = ?");
        if (!$delStmt) {
            error_log("Prepare failed (replace - delete): " . $this->db->error);
            return;
        }

        $delStmt->bind_param('s', $productId);
        if (!$delStmt->execute()) {
            error_log("Execute failed (replace - delete): " . $delStmt->error);
            return;
        }

        $insStmt = $this->db->prepare("
            INSERT INTO product_specifications (product_id, spec_name, spec_value)
            VALUES (?, ?, ?)
        ");
        if (!$insStmt) {
            error_log("Prepare failed (replace - insert): " . $this->db->error);
            return;
        }

        foreach ($specs as $spec) {
            $specName = $spec['spec_name'] ?? '';
            $specValue = $spec['spec_value'] ?? '';

            $insStmt->bind_param('sss', $productId, $specName, $specValue);
            if (!$insStmt->execute()) {
                error_log("Execute failed (replace - insert): " . $insStmt->error);
            }
        }
    }
}
