<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

class Brand
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM brands WHERE is_active = 1 ORDER BY name';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(int $id): ?array
    {
        $query = 'SELECT * FROM brands WHERE brand_id = ? LIMIT 1';
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
        $query = 'SELECT * FROM brands WHERE slug = ? AND is_active = 1 LIMIT 1';
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

    public function search(string $query): array
    {
        $searchQuery = 'SELECT * FROM brands WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1 ORDER BY name';
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
            ->key('logo_url', v::optional(v::stringType()))
            ->key('is_active', v::optional(v::boolType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $query = 'INSERT INTO brands (name, slug, description, logo_url, is_active) VALUES (?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $isActive = $data['is_active'] ?? true;
        $description = $data['description'] ?? null;
        $logoUrl = $data['logo_url'] ?? null;

        $stmt->bind_param('ssssi', $data['name'], $data['slug'], $description, $logoUrl, $isActive);

        if ($stmt->execute()) {
            return $this->findById($this->db->insert_id);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $types = '';
        $values = [];

        $allowedFields = ['name', 'slug', 'description', 'logo_url', 'is_active'];

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

        $query = 'UPDATE brands SET ' . implode(', ', $fields) . ', updated_at = CURRENT_TIMESTAMP WHERE brand_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $types .= 'i';
        $values[] = $id;

        $stmt->bind_param($types, ...$values);
        return $stmt->execute();
    }

    public function delete(int $id): bool
    {
        $query = 'DELETE FROM brands WHERE brand_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}
