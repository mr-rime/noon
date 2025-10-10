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
        $query = 'SELECT * FROM categories WHERE is_active = 1 ORDER BY name';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM categories WHERE category_id = ? LIMIT 1';
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
        $query = 'SELECT * FROM categories WHERE slug = ? AND is_active = 1 LIMIT 1';
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

    public function search(string $query): array
    {
        $searchQuery = 'SELECT * FROM categories WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1 ORDER BY name';
        $stmt = $this->db->prepare($searchQuery);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $searchTerm = '%' . $query . '%';
        $stmt->bind_param('ss', $searchTerm, $searchTerm);
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
            ->key('description', v::optional(v::stringType()))
            ->key('is_active', v::optional(v::boolType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $query = 'INSERT INTO categories (name, slug, description, is_active) VALUES (?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $isActive = $data['is_active'] ?? true;
        $description = $data['description'] ?? null;

        $stmt->bind_param('sssi', $data['name'], $data['slug'], $description, $isActive);

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

        $allowedFields = ['name', 'slug', 'description', 'is_active'];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                if ($field === 'is_active') {
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

        $query = 'UPDATE categories SET ' . implode(', ', $fields) . ', updated_at = CURRENT_TIMESTAMP WHERE category_id = ?';
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
        $query = 'DELETE FROM categories WHERE category_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }

    public function getWithSubcategories(): array
    {
        $query = '
            SELECT 
                c.category_id,
                c.name as category_name,
                c.slug as category_slug,
                c.description as category_description,
                s.subcategory_id,
                s.name as subcategory_name,
                s.slug as subcategory_slug,
                s.description as subcategory_description
            FROM categories c
            LEFT JOIN subcategories s ON c.category_id = s.category_id AND s.is_active = 1
            WHERE c.is_active = 1
            ORDER BY c.name, s.name
        ';

        $result = $this->db->query($query);
        if (!$result) {
            return [];
        }

        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $categories = [];

        foreach ($rows as $row) {
            $categoryId = $row['category_id'];

            if (!isset($categories[$categoryId])) {
                $categories[$categoryId] = [
                    'category_id' => $row['category_id'],
                    'name' => $row['category_name'],
                    'slug' => $row['category_slug'],
                    'description' => $row['category_description'],
                    'subcategories' => []
                ];
            }

            if ($row['subcategory_id']) {
                $categories[$categoryId]['subcategories'][] = [
                    'subcategory_id' => $row['subcategory_id'],
                    'name' => $row['subcategory_name'],
                    'slug' => $row['subcategory_slug'],
                    'description' => $row['subcategory_description']
                ];
            }
        }

        return array_values($categories);
    }
}
