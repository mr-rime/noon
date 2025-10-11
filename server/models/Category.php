<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';

class Category
{
    private mysqli $db;
    private int $maxLevel = 4; // Maximum nesting level (0-4 = 5 levels total)

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function findAll(): array
    {
        $query = 'SELECT * FROM categories_nested WHERE is_active = 1 ORDER BY level, display_order, name';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findRootCategories(): array
    {
        $query = 'SELECT * FROM categories_nested WHERE parent_id IS NULL AND is_active = 1 ORDER BY display_order, name';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findByParentId(?int $parentId = null): array
    {
        if ($parentId === null) {
            return $this->findRootCategories();
        }

        $query = 'SELECT * FROM categories_nested WHERE parent_id = ? AND is_active = 1 ORDER BY display_order, name';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('i', $parentId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function findById(int $id, bool $includeChildren = false): ?array
    {
        $query = 'SELECT * FROM categories_nested WHERE category_id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $category = $result->fetch_assoc();

        if ($category && $includeChildren) {
            $category['children'] = $this->findByParentId($id);
        }

        return $category ?: null;
    }

    public function findBySlug(string $slug, bool $includeChildren = false): ?array
    {
        $query = 'SELECT * FROM categories_nested WHERE slug = ? AND is_active = 1 LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $slug);
        $stmt->execute();
        $result = $stmt->get_result();
        $category = $result->fetch_assoc();

        if ($category && $includeChildren) {
            $category['children'] = $this->findByParentId($category['category_id']);
        }

        return $category ?: null;
    }

    public function findByNestedPath(string $path, bool $includeChildren = false): ?array
    {
        // Split the path into individual slugs
        $slugs = explode('/', trim($path, '/'));

        if (empty($slugs) || empty($slugs[0])) {
            return null;
        }

        // Find the root category
        $currentCategory = $this->findBySlug($slugs[0], true);
        if (!$currentCategory) {
            return null;
        }

        // If this is a single slug, return it
        if (count($slugs) === 1) {
            if ($includeChildren) {
                $currentCategory['children'] = $this->findByParentId($currentCategory['category_id']);
            }
            return $currentCategory;
        }

        // Navigate through the nested path
        $currentId = $currentCategory['category_id'];

        for ($i = 1; $i < count($slugs); $i++) {
            $slug = $slugs[$i];

            // Find the child category with this slug
            $query = 'SELECT * FROM categories_nested WHERE parent_id = ? AND slug = ? AND is_active = 1 LIMIT 1';
            $stmt = $this->db->prepare($query);

            if (!$stmt) {
                error_log("Prepare failed: " . $this->db->error);
                return null;
            }

            $stmt->bind_param('is', $currentId, $slug);
            $stmt->execute();
            $result = $stmt->get_result();
            $childCategory = $result->fetch_assoc();

            if (!$childCategory) {
                return null;
            }

            $currentCategory = $childCategory;
            $currentId = $childCategory['category_id'];
        }

        // Add children if requested
        if ($includeChildren) {
            $currentCategory['children'] = $this->findByParentId($currentCategory['category_id']);
        }

        return $currentCategory;
    }

    public function findByName(string $name, ?int $parentId = null): ?array
    {
        if ($parentId === null) {
            $query = 'SELECT * FROM categories_nested WHERE name = ? AND parent_id IS NULL LIMIT 1';
            $stmt = $this->db->prepare($query);

            if (!$stmt) {
                error_log("Prepare failed: " . $this->db->error);
                return null;
            }

            $stmt->bind_param('s', $name);
        } else {
            $query = 'SELECT * FROM categories_nested WHERE name = ? AND parent_id = ? LIMIT 1';
            $stmt = $this->db->prepare($query);

            if (!$stmt) {
                error_log("Prepare failed: " . $this->db->error);
                return null;
            }

            $stmt->bind_param('si', $name, $parentId);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_assoc() ?: null;
    }

    public function search(string $query): array
    {
        $searchQuery = 'SELECT * FROM categories_nested WHERE (name LIKE ? OR description LIKE ?) AND is_active = 1 ORDER BY level, name';
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
        // Normalize data types
        if (isset($data['is_active'])) {
            if ($data['is_active'] === null) {
                $data['is_active'] = true;
            } else if (is_string($data['is_active'])) {
                $data['is_active'] = strtolower($data['is_active']) === 'true';
            }
        }

        // Ensure boolean values are properly typed
        if (isset($data['parent_id']) && $data['parent_id'] === '') {
            $data['parent_id'] = null;
        }

        // Validate slug format (alphanumeric, hyphens, underscores only)
        $slugValidator = v::stringType()->notEmpty()->length(1, 120)->regex('/^[a-z0-9-_]+$/');

        // Ensure all optional fields have default values
        $data = array_merge([
            'parent_id' => null,
            'description' => null,
            'display_order' => 0,
            'image_url' => null,
            'icon_url' => null,
            'is_active' => true
        ], $data);

        $validator = v::key('name', v::stringType()->notEmpty()->length(1, 100))
            ->key('slug', $slugValidator)
            ->key('parent_id', v::nullable(v::intType()))
            ->key('description', v::nullable(v::stringType()))
            ->key('display_order', v::intType())
            ->key('image_url', v::nullable(v::stringType()))
            ->key('icon_url', v::nullable(v::stringType()))
            ->key('is_active', v::boolType());

        try {
            $validator->assert($data);
        } catch (ValidationException $e) {
            error_log("Validation failed: " . $e->getMessage());
            error_log("Validation data: " . json_encode($data));
            return null;
        }

        // Check if slug already exists at the same parent level
        $existingCategory = $this->findBySlug($data['slug']);
        if ($existingCategory) {
            $existingParentId = $existingCategory['parent_id'];
            $newParentId = $data['parent_id'] ?? null;

            // If both are null (root level) or both have the same parent, slug conflict
            if ($existingParentId === $newParentId) {
                error_log("Slug already exists at the same level: " . $data['slug']);
                return null;
            }
        }

        // Calculate level based on parent
        $level = 0;
        $parent = null;
        if (!empty($data['parent_id'])) {
            $parent = $this->findById($data['parent_id']);
            if (!$parent) {
                error_log("Parent category not found");
                return null;
            }
            $level = $parent['level'] + 1;

            // Check max level
            if ($level > $this->maxLevel) {
                error_log("Maximum nesting level exceeded");
                return null;
            }
        }

        $query = 'INSERT INTO categories_nested (parent_id, name, slug, description, level, display_order, image_url, icon_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $parentId = $data['parent_id'] ?? null;
        $isActive = $data['is_active'] ?? true;
        $description = $data['description'] ?? null;
        $displayOrder = $data['display_order'] ?? 0;
        $imageUrl = $data['image_url'] ?? null;
        $iconUrl = $data['icon_url'] ?? null;

        $stmt->bind_param('issssissi', $parentId, $data['name'], $data['slug'], $description, $level, $displayOrder, $imageUrl, $iconUrl, $isActive);

        if ($stmt->execute()) {
            $newId = $this->db->insert_id;

            // Update path
            if ($parent) {
                $path = $parent['path'] . $newId . '/';
            } else {
                $path = '/' . $newId . '/';
            }

            $updatePath = 'UPDATE categories_nested SET path = ? WHERE category_id = ?';
            $updateStmt = $this->db->prepare($updatePath);
            $updateStmt->bind_param('si', $path, $newId);
            $updateStmt->execute();

            return $this->findById($newId);
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

        $allowedFields = ['name', 'slug', 'description', 'display_order', 'image_url', 'icon_url', 'is_active'];

        // Don't allow parent_id changes through update (use moveCategory instead)
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                if ($field === 'is_active' || $field === 'display_order') {
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

        $query = 'UPDATE categories_nested SET ' . implode(', ', $fields) . ', updated_at = CURRENT_TIMESTAMP WHERE category_id = ?';
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
        // Check if category has children
        $children = $this->findByParentId($id);
        if (!empty($children)) {
            error_log("Cannot delete category with children");
            return false;
        }

        $query = 'DELETE FROM categories_nested WHERE category_id = ?';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return false;
        }

        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }

    public function getCategoryTree(?int $parentId = null, int $maxDepth = 5): array
    {
        $categories = $this->findByParentId($parentId);

        if ($maxDepth > 1) {
            foreach ($categories as &$category) {
                $category['children'] = $this->getCategoryTree($category['category_id'], $maxDepth - 1);
            }
        }

        return $categories;
    }

    public function getBreadcrumb(int $categoryId): array
    {
        $breadcrumb = [];
        $current = $this->findById($categoryId);

        while ($current) {
            array_unshift($breadcrumb, [
                'id' => $current['category_id'],
                'name' => $current['name'],
                'slug' => $current['slug'],
                'level' => $current['level']
            ]);

            if ($current['parent_id']) {
                $current = $this->findById($current['parent_id']);
            } else {
                break;
            }
        }

        return $breadcrumb;
    }

    public function getAncestors(int $categoryId): array
    {
        $ancestors = [];
        $current = $this->findById($categoryId);

        while ($current && $current['parent_id']) {
            $parent = $this->findById($current['parent_id']);
            if ($parent) {
                array_unshift($ancestors, $parent);
                $current = $parent;
            } else {
                break;
            }
        }

        return $ancestors;
    }

    public function getDescendants(int $categoryId): array
    {
        $query = "SELECT * FROM categories_nested WHERE path LIKE ? AND is_active = 1 ORDER BY level, display_order, name";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $pathPattern = '%/' . $categoryId . '/%';
        $stmt->bind_param('s', $pathPattern);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAllDescendantIds(int $categoryId): array
    {
        // Get the category itself first
        $category = $this->findById($categoryId);
        if (!$category) {
            return [];
        }

        $ids = [$categoryId]; // Include the category itself

        // Get all descendants using the path
        $query = "SELECT category_id FROM categories_nested WHERE path LIKE ? AND is_active = 1";
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return $ids;
        }

        $pathPattern = '%/' . $categoryId . '/%';
        $stmt->bind_param('s', $pathPattern);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {
            $ids[] = (int) $row['category_id'];
        }

        return $ids;
    }

    public function moveCategory(int $categoryId, ?int $newParentId = null): bool
    {
        $category = $this->findById($categoryId);
        if (!$category) {
            error_log("Category not found");
            return false;
        }

        // Check if new parent exists (if not null)
        $newLevel = 0;
        $newPath = '/' . $categoryId . '/';

        if ($newParentId !== null) {
            $newParent = $this->findById($newParentId);
            if (!$newParent) {
                error_log("New parent category not found");
                return false;
            }

            // Prevent moving to a descendant
            $descendants = $this->getDescendants($categoryId);
            foreach ($descendants as $desc) {
                if ($desc['category_id'] == $newParentId) {
                    error_log("Cannot move category to its own descendant");
                    return false;
                }
            }

            $newLevel = $newParent['level'] + 1;
            $newPath = $newParent['path'] . $categoryId . '/';

            // Check max level
            if ($newLevel > $this->maxLevel) {
                error_log("Maximum nesting level would be exceeded");
                return false;
            }
        }

        // Update the category and all its descendants
        $this->db->begin_transaction();

        try {
            // Update the category itself
            $updateQuery = 'UPDATE categories_nested SET parent_id = ?, level = ?, path = ? WHERE category_id = ?';
            $stmt = $this->db->prepare($updateQuery);
            $stmt->bind_param('iisi', $newParentId, $newLevel, $newPath, $categoryId);

            if (!$stmt->execute()) {
                throw new Exception("Failed to update category");
            }

            // Update all descendants
            $this->updateDescendantPaths($categoryId, $newPath, $newLevel);

            $this->db->commit();
            return true;

        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Move category failed: " . $e->getMessage());
            return false;
        }
    }

    private function updateDescendantPaths(int $categoryId, string $newBasePath, int $baseLevel): void
    {
        $children = $this->findByParentId($categoryId);

        foreach ($children as $child) {
            $childId = $child['category_id'];
            $childLevel = $baseLevel + 1;
            $childPath = $newBasePath . $childId . '/';

            $query = 'UPDATE categories_nested SET level = ?, path = ? WHERE category_id = ?';
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('isi', $childLevel, $childPath, $childId);
            $stmt->execute();

            // Recursively update descendants
            $this->updateDescendantPaths($childId, $childPath, $childLevel);
        }
    }
}
