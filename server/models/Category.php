<?php

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;
require_once __DIR__ . '/../utils/generateHash.php';

class Category
{
    private mysqli $db;
    private int $maxLevel = 4;

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
        $query = 'SELECT * FROM categories_nested WHERE parent_id IS NULL AND is_active = 1 ORDER BY category_id ASC';
        $result = $this->db->query($query);

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function findByParentId(?string $parentId = null): array
    {
        if ($parentId === null) {
            return $this->findRootCategories();
        }

        $query = 'SELECT * FROM categories_nested WHERE parent_id = ? AND is_active = 1 ORDER BY category_id ASC';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return [];
        }

        $stmt->bind_param('s', $parentId);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function findById(string $id, bool $includeChildren = false): ?array
    {
        $query = 'SELECT * FROM categories_nested WHERE category_id = ? LIMIT 1';
        $stmt = $this->db->prepare($query);

        if (!$stmt) {
            error_log("Prepare failed: " . $this->db->error);
            return null;
        }

        $stmt->bind_param('s', $id);
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
        $slugs = explode('/', trim($path, '/'));

        if (empty($slugs) || empty($slugs[0])) {
            return null;
        }


        $currentCategory = $this->findBySlug($slugs[0], true);
        if (!$currentCategory) {
            return null;
        }


        if (count($slugs) === 1) {
            if ($includeChildren) {
                $currentCategory['children'] = $this->findByParentId($currentCategory['category_id']);
            }
            return $currentCategory;
        }


        $currentId = $currentCategory['category_id'];

        for ($i = 1; $i < count($slugs); $i++) {
            $slug = $slugs[$i];


            $query = 'SELECT * FROM categories_nested WHERE parent_id = ? AND slug = ? AND is_active = 1 LIMIT 1';
            $stmt = $this->db->prepare($query);

            if (!$stmt) {
                error_log("Prepare failed: " . $this->db->error);
                return null;
            }

            $stmt->bind_param('ss', $currentId, $slug);
            $stmt->execute();
            $result = $stmt->get_result();
            $childCategory = $result->fetch_assoc();

            if (!$childCategory) {
                return null;
            }

            $currentCategory = $childCategory;
            $currentId = $childCategory['category_id'];
        }


        if ($includeChildren) {
            $currentCategory['children'] = $this->findByParentId($currentCategory['category_id']);
        }

        return $currentCategory;
    }

    public function findByName(string $name, ?string $parentId = null): ?array
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

            $stmt->bind_param('ss', $name, $parentId);
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

        if (isset($data['is_active'])) {
            if ($data['is_active'] === null) {
                $data['is_active'] = true;
            } else if (is_string($data['is_active'])) {
                $data['is_active'] = strtolower($data['is_active']) === 'true';
            }
        }


        if (isset($data['parent_id']) && $data['parent_id'] === '') {
            $data['parent_id'] = null;
        }


        $slugValidator = v::stringType()->notEmpty()->length(1, 120)->regex('/^[a-z0-9-_]+$/');


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
            ->key('parent_id', v::nullable(v::stringType()))
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


        $existingCategory = $this->findBySlug($data['slug']);
        if ($existingCategory) {
            $existingParentId = $existingCategory['parent_id'];
            $newParentId = $data['parent_id'] ?? null;


            if ($existingParentId === $newParentId) {
                error_log("Slug already exists at the same level: " . $data['slug']);
                return null;
            }
        }


        $level = 0;
        $parent = null;
        if (!empty($data['parent_id']) && $data['parent_id'] !== null) {
            $parent = $this->findById($data['parent_id']);
            if (!$parent) {
                error_log("Parent category not found");
                return null;
            }
            $level = $parent['level'] + 1;


            if ($level > $this->maxLevel) {
                error_log("Maximum nesting level exceeded");
                return null;
            }
        }

        $categoryId = generateHash();
        $query = 'INSERT INTO categories_nested (category_id, parent_id, name, slug, description, level, display_order, image_url, icon_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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

        $stmt->bind_param('sssssiissi', $categoryId, $parentId, $data['name'], $data['slug'], $description, $level, $displayOrder, $imageUrl, $iconUrl, $isActive);

        if ($stmt->execute()) {
            $newId = $categoryId;


            if ($parent) {
                $path = $parent['path'] . $newId . '/';
            } else {
                $path = '/' . $newId . '/';
            }

            $updatePath = 'UPDATE categories_nested SET path = ? WHERE category_id = ?';
            $updateStmt = $this->db->prepare($updatePath);
            $updateStmt->bind_param('ss', $path, $newId);
            $updateStmt->execute();

            return $this->findById($newId);
        } else {
            error_log("Execute failed: " . $stmt->error);
            return null;
        }
    }

    public function update(string $id, array $data)
    {
        $fields = [];
        $types = '';
        $values = [];

        $allowedFields = ['name', 'slug', 'description', 'display_order', 'image_url', 'icon_url', 'is_active'];


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

        $types .= 's';
        $values[] = $id;

        $stmt->bind_param($types, ...$values);

        if ($stmt->execute()) {
            return $this->findById($id);
        }

        return false;
    }

    public function delete(string $id): bool
    {

        $descendants = $this->getAllDescendantIds($id);


        $this->db->begin_transaction();

        try {


            $query = "SELECT category_id, level FROM categories_nested WHERE category_id IN (" .
                implode(',', array_fill(0, count($descendants), '?')) . ") ORDER BY level DESC";

            if (count($descendants) > 0) {
                $stmt = $this->db->prepare($query);
                if (!$stmt) {
                    throw new Exception("Prepare failed: " . $this->db->error);
                }

                $types = str_repeat('s', count($descendants));
                $stmt->bind_param($types, ...$descendants);
                $stmt->execute();
                $result = $stmt->get_result();

                $categoriesToDelete = [];
                while ($row = $result->fetch_assoc()) {
                    $categoriesToDelete[] = $row['category_id'];
                }


                foreach ($categoriesToDelete as $categoryId) {
                    $deleteQuery = 'DELETE FROM categories_nested WHERE category_id = ?';
                    $deleteStmt = $this->db->prepare($deleteQuery);

                    if (!$deleteStmt) {
                        throw new Exception("Prepare failed: " . $this->db->error);
                    }

                    $deleteStmt->bind_param('s', $categoryId);
                    if (!$deleteStmt->execute()) {
                        throw new Exception("Delete failed: " . $deleteStmt->error);
                    }
                }
            }


            $deleteQuery = 'DELETE FROM categories_nested WHERE category_id = ?';
            $deleteStmt = $this->db->prepare($deleteQuery);

            if (!$deleteStmt) {
                throw new Exception("Prepare failed: " . $this->db->error);
            }

            $deleteStmt->bind_param('s', $id);
            if (!$deleteStmt->execute()) {
                throw new Exception("Delete failed: " . $deleteStmt->error);
            }

            $this->db->commit();
            return true;

        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Cascading delete failed: " . $e->getMessage());
            return false;
        }
    }

    public function getCategoryTree(?string $parentId = null, int $maxDepth = 5): array
    {
        $categories = $this->findByParentId($parentId);

        if ($maxDepth > 1) {
            foreach ($categories as &$category) {
                $category['children'] = $this->getCategoryTree($category['category_id'], $maxDepth - 1);
            }
        }

        return $categories;
    }

    public function getBreadcrumb(string $categoryId): array
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

    public function getAncestors(string $categoryId): array
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

    public function getDescendants(string $categoryId): array
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

    public function getAllDescendantIds(string $categoryId): array
    {

        $category = $this->findById($categoryId);
        if (!$category) {
            return [];
        }

        $ids = [$categoryId];


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
            $ids[] = $row['category_id'];
        }

        return $ids;
    }

    public function moveCategory(string $categoryId, ?string $newParentId = null): bool
    {
        $category = $this->findById($categoryId);
        if (!$category) {
            error_log("Category not found");
            return false;
        }


        $newLevel = 0;
        $newPath = '/' . $categoryId . '/';

        if ($newParentId !== null) {
            $newParent = $this->findById($newParentId);
            if (!$newParent) {
                error_log("New parent category not found");
                return false;
            }


            $descendants = $this->getDescendants($categoryId);
            foreach ($descendants as $desc) {
                if ($desc['category_id'] == $newParentId) {
                    error_log("Cannot move category to its own descendant");
                    return false;
                }
            }

            $newLevel = $newParent['level'] + 1;
            $newPath = $newParent['path'] . $categoryId . '/';


            if ($newLevel > $this->maxLevel) {
                error_log("Maximum nesting level would be exceeded");
                return false;
            }
        }


        $this->db->begin_transaction();

        try {

            $updateQuery = 'UPDATE categories_nested SET parent_id = ?, level = ?, path = ? WHERE category_id = ?';
            $stmt = $this->db->prepare($updateQuery);
            $stmt->bind_param('siss', $newParentId, $newLevel, $newPath, $categoryId);

            if (!$stmt->execute()) {
                throw new Exception("Failed to update category");
            }


            $this->updateDescendantPaths($categoryId, $newPath, $newLevel);

            $this->db->commit();
            return true;

        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Move category failed: " . $e->getMessage());
            return false;
        }
    }

    private function updateDescendantPaths(string $categoryId, string $newBasePath, int $baseLevel): void
    {
        $children = $this->findByParentId($categoryId);

        foreach ($children as $child) {
            $childId = $child['category_id'];
            $childLevel = $baseLevel + 1;
            $childPath = $newBasePath . $childId . '/';

            $query = 'UPDATE categories_nested SET level = ?, path = ? WHERE category_id = ?';
            $stmt = $this->db->prepare($query);
            $stmt->bind_param('iss', $childLevel, $childPath, $childId);
            $stmt->execute();


            $this->updateDescendantPaths($childId, $childPath, $childLevel);
        }
    }
}
