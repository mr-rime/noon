<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';

class ProductGroup
{
    private mysqli $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM product_groups ORDER BY name';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findById(string $id): ?array
    {
        $query = 'SELECT * FROM product_groups WHERE group_id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc() ?: null;
    }

    public function findByName(string $name): ?array
    {
        $query = 'SELECT * FROM product_groups WHERE name = ? LIMIT 1';
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

    public function findByCategoryId(int $categoryId): array
    {
        $query = 'SELECT * FROM product_groups WHERE category_id = ? ORDER BY name';
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

    public function create(array $data): ?array
    {
        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 200))
            ->key('description', v::optional(v::stringType()))
            ->key('category_id', v::optional(v::intVal()->positive()))
            ->key('subcategory_id', v::optional(v::intVal()->positive()))
            ->key('brand_id', v::optional(v::intVal()->positive()))
            ->key('attributes', v::optional(v::arrayType()));

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            return null;
        }

        $groupId = generateHash();
        $query = 'INSERT INTO product_groups (group_id, name, description, category_id, subcategory_id, brand_id, attributes) VALUES (?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $description = $data['description'] ?? null;
        $categoryId = $data['category_id'] ?? null;
        $subcategoryId = $data['subcategory_id'] ?? null;
        $brandId = $data['brand_id'] ?? null;
        $attributes = isset($data['attributes']) ? json_encode($data['attributes']) : null;

        $stmt->bind_param('sssiiss', $groupId, $data['name'], $description, $categoryId, $subcategoryId, $brandId, $attributes);

        if ($stmt->execute()) {
            return $this->findById($groupId);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(string $id, array $data): ?array
    {
        $fields = [];
        $types = '';
        $values = [];

        $allowedFields = ['name', 'description', 'category_id', 'subcategory_id', 'brand_id', 'attributes'];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";

                if (in_array($field, ['category_id', 'subcategory_id', 'brand_id'])) {
                    $types .= 'i';
                    $values[] = $data[$field];
                } elseif ($field === 'attributes') {
                    $types .= 's';
                    $values[] = is_array($data[$field]) ? json_encode($data[$field]) : $data[$field];
                } else {
                    $types .= 's';
                    $values[] = $data[$field];
                }
            }
        }

        if (empty($fields)) {
            return $this->findById($id);
        }

        $query = 'UPDATE product_groups SET ' . implode(', ', $fields) . ', updated_at = CURRENT_TIMESTAMP WHERE group_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $types .= 's';
        $values[] = $id;

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            return $this->findById($id);
        }

        error_log("Execute failed: " . $stmt->error);
        return null;
    }

    public function delete(string $id): bool
    {
        $query = 'DELETE FROM product_groups WHERE group_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $id);
        return $stmt->execute();
    }

    public function getProductsInGroup(string $groupId): array
    {
        $query = '
            SELECT p.id, p.psku, p.name, p.price, p.final_price, p.currency, p.stock,
                   p.product_overview, p.is_returnable, p.category_id, p.subcategory_id,
                   p.brand_id, p.group_id, p.created_at, p.updated_at,
                   c.name as category_name,
                   s.name as subcategory_name,
                   b.name as brand_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN subcategories s ON p.subcategory_id = s.subcategory_id
            LEFT JOIN brands b ON p.brand_id = b.brand_id
            WHERE p.group_id = ?
            ORDER BY p.created_at ASC, p.id ASC
        ';

        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('s', $groupId);
        $stmt->execute();
        $result = $stmt->get_result();
        $products = $result->fetch_all(MYSQLI_ASSOC);

        // Enrich each product with images and attributes
        foreach ($products as &$product) {
            // Fetch images
            $imageQuery = 'SELECT id, image_url, is_primary FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC';
            $imageStmt = $this->db->prepare($imageQuery);
            if ($imageStmt) {
                $imageStmt->bind_param('s', $product['id']);
                $imageStmt->execute();
                $imageResult = $imageStmt->get_result();
                $product['images'] = $imageResult->fetch_all(MYSQLI_ASSOC);
                
                // Convert is_primary to boolean
                foreach ($product['images'] as &$image) {
                    $image['is_primary'] = (bool) $image['is_primary'];
                }
            } else {
                $product['images'] = [];
            }

            // Fetch product attributes
            $attrQuery = 'SELECT id, attribute_name, attribute_value FROM product_attribute_values WHERE product_id = ? ORDER BY attribute_name';
            $attrStmt = $this->db->prepare($attrQuery);
            if ($attrStmt) {
                $attrStmt->bind_param('s', $product['id']);
                $attrStmt->execute();
                $attrResult = $attrStmt->get_result();
                $product['productAttributes'] = $attrResult->fetch_all(MYSQLI_ASSOC);
            } else {
                $product['productAttributes'] = [];
            }
        }

        return $products;
    }

    public function addProductToGroup(string $groupId, string $productId): bool
    {
        $query = 'UPDATE products SET group_id = ? WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('ss', $groupId, $productId);
        return $stmt->execute();
    }

    public function removeProductFromGroup(string $productId): bool
    {
        $query = 'UPDATE products SET group_id = NULL WHERE id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('s', $productId);
        return $stmt->execute();
    }

    public function getGroupAttributes(string $groupId): array
    {
        $query = 'SELECT * FROM product_group_attributes WHERE group_id = ? ORDER BY display_order, attribute_name';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('s', $groupId);
        $stmt->execute();
        $result = $stmt->get_result();

        $attributes = $result->fetch_all(MYSQLI_ASSOC);

        // Parse JSON attribute_values
        foreach ($attributes as &$attribute) {
            if ($attribute['attribute_values']) {
                $attribute['attribute_values'] = json_decode($attribute['attribute_values'], true);
            }
        }

        return $attributes;
    }

    public function setGroupAttributes(string $groupId, array $attributes): bool
    {
        // Start transaction
        $this->db->begin_transaction();

        try {
            // Delete existing attributes
            $deleteQuery = 'DELETE FROM product_group_attributes WHERE group_id = ?';
            $deleteStmt = $this->db->prepare($deleteQuery);
            $deleteStmt->bind_param('s', $groupId);
            $deleteStmt->execute();

            // Insert new attributes
            $insertQuery = 'INSERT INTO product_group_attributes (group_id, attribute_name, attribute_values, is_required, display_order) VALUES (?, ?, ?, ?, ?)';
            $insertStmt = $this->db->prepare($insertQuery);

            foreach ($attributes as $index => $attribute) {
                $attributeValues = is_array($attribute['attribute_values']) ? json_encode($attribute['attribute_values']) : $attribute['attribute_values'];
                $isRequired = $attribute['is_required'] ?? true;
                $displayOrder = $attribute['display_order'] ?? $index;

                $insertStmt->bind_param('sssii', $groupId, $attribute['attribute_name'], $attributeValues, $isRequired, $displayOrder);
                $insertStmt->execute();
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Failed to set group attributes: " . $e->getMessage());
            return false;
        }
    }
}
