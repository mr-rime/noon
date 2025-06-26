<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';

class Category
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM categories';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM categories WHERE id = ? LIMIT 1';
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

    public function findByName(string $name): ?array
    {
        $query = 'SELECT * FROM categories WHERE name = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $name);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc() ?: null;
    }

    public function create(array $data): ?array
    {
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 100));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $query = 'INSERT INTO categories (name) VALUES (?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $data['name']);

        if ($stmt->execute()) {
            return $this->findById($this->db->insert_id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $id, array $data): bool
    {
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 100));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return false;
        }

        $query = 'UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('si', $data['name'], $id);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM categories WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}
