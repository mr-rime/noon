<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class Subcategory
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM subcategories WHERE is_active = 1 ORDER BY name';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM subcategories WHERE subcategory_id = ? LIMIT 1';
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

    public function findBySlug(string $slug): ?array
    {
        $query = 'SELECT * FROM subcategories WHERE slug = ? AND is_active = 1 LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $slug);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc() ?: null;
    }

    public function findByCategoryId(int $categoryId): array
    {
        $query = 'SELECT * FROM subcategories WHERE category_id = ? AND is_active = 1 ORDER BY name';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('i', $categoryId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function search(string $query, ?int $categoryId = null): array
    {
        $searchQuery = 'SELECT * FROM subcategories WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1';
        $params = ['ss'];
        $values = ['%' . $query . '%', '%' . $query . '%'];

        if ($categoryId !== null) {
            $searchQuery .= ' AND category_id = ?';
            $params[0] .= 'i';
            $values[] = $categoryId;
        }

        $searchQuery .= ' ORDER BY name';

        $stmt = $this->db->prepare($searchQuery);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param($params[0], ...$values);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function create(array $data): ?array
    {

        if (isset($data['is_active']) && $data['is_active'] === null) {
            $data['is_active'] = true;
        }

        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 100))
            ->key('slug', v::stringType()->notEmpty()->length(1, 120))
            ->key('category_id', v::intVal()->positive())
            ->key('description', v::optional(v::stringType()))
            ->key('is_active', v::optional(v::boolType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $query = 'INSERT INTO subcategories (category_id, name, slug, description, is_active) VALUES (?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $isActive = $data['is_active'] ?? true;
        $description = $data['description'] ?? null;

        $stmt->bind_param('isssi', $data['category_id'], $data['name'], $data['slug'], $description, $isActive);

        if ($stmt->execute()) {
            return $this->findById($this->db->insert_id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $id, array $data)
    {
        $fields = [];
        $types = '';
        $values = [];

        $allowedFields = ['category_id', 'name', 'slug', 'description', 'is_active'];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                if (in_array($field, ['category_id', 'is_active'])) {
                    $types .= 'i';
                    $values[] = (int) $data[$field];
                } else {
                    $types .= 's';
                    $values[] = $data[$field];
                }
            }
        }

        if (empty($fields)) {
            return false;
        }

        $query = 'UPDATE subcategories SET ' . implode(', ', $fields) . ', updated_at = CURRENT_TIMESTAMP WHERE subcategory_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $types .= 'i';
        $values[] = $id;

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            return $this->findById($id);
        }

        return false;
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM subcategories WHERE subcategory_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}
