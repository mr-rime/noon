<?php

require_once __DIR__ . '/../config/db.php';

/**
 * Quick fix for categories_nested table to use varchar(21) category_id
 */

try {
    echo "Fixing categories_nested table structure...\n";

    // Get database connection
    $db = new Database()->getConnection();

    // Disable foreign key checks
    $db->query("SET FOREIGN_KEY_CHECKS = 0");

    // Step 1: Check current table structure
    echo "Checking table structure...\n";
    $result = $db->query("SHOW COLUMNS FROM categories_nested WHERE Field = 'category_id'");
    $column = $result->fetch_assoc();

    if ($column && strpos($column['Type'], 'varchar') !== false) {
        echo "✅ Table already uses varchar for category_id. Migration may already be complete.\n";
        echo "Current category_id type: " . $column['Type'] . "\n";
        exit(0);
    }

    // Check if new_category_id column already exists
    $result = $db->query("SHOW COLUMNS FROM categories_nested LIKE 'new_category_id'");

    if ($result->num_rows == 0) {
        echo "Adding new category_id column...\n";
        $db->query("ALTER TABLE categories_nested ADD COLUMN new_category_id VARCHAR(21) AFTER category_id");
    } else {
        echo "new_category_id column already exists, continuing with migration...\n";
    }

    // Step 2: Check if new_category_id already has data
    $result = $db->query("SELECT COUNT(*) as count FROM categories_nested WHERE new_category_id IS NOT NULL");
    $row = $result->fetch_assoc();

    if ($row['count'] > 0) {
        echo "new_category_id already has data, skipping ID generation...\n";
    } else {
        echo "Generating new IDs for existing categories...\n";
        $result = $db->query("SELECT category_id FROM categories_nested ORDER BY level ASC, category_id ASC");
        $counter = 1;

        while ($row = $result->fetch_assoc()) {
            $oldId = $row['category_id'];
            $newId = 'cat_' . str_pad($counter, 3, '0', STR_PAD_LEFT);

            $stmt = $db->prepare("UPDATE categories_nested SET new_category_id = ? WHERE category_id = ?");
            $stmt->bind_param('si', $newId, $oldId);
            $stmt->execute();
            $counter++;
        }
    }

    // Step 3: Create mapping for parent references
    echo "Updating parent references...\n";
    $mapping = [];
    $result = $db->query("SELECT category_id, new_category_id FROM categories_nested");
    while ($row = $result->fetch_assoc()) {
        $mapping[$row['category_id']] = $row['new_category_id'];
    }

    // Update parent_id references
    $result = $db->query("SELECT category_id, parent_id FROM categories_nested WHERE parent_id IS NOT NULL");
    while ($row = $result->fetch_assoc()) {
        $categoryId = $row['category_id'];
        $oldParentId = $row['parent_id'];
        $newParentId = $mapping[$oldParentId] ?? null;

        if ($newParentId) {
            $db->query("UPDATE categories_nested SET parent_id = '$newParentId' WHERE category_id = $categoryId");
        }
    }

    // Step 4: Drop old constraints and columns
    echo "Updating table structure...\n";
    $db->query("ALTER TABLE categories_nested DROP PRIMARY KEY");
    $db->query("ALTER TABLE categories_nested DROP FOREIGN KEY IF EXISTS fk_categories_parent");
    $db->query("ALTER TABLE categories_nested DROP COLUMN category_id");
    $db->query("ALTER TABLE categories_nested CHANGE new_category_id category_id VARCHAR(21) PRIMARY KEY");
    $db->query("ALTER TABLE categories_nested MODIFY COLUMN parent_id VARCHAR(21) DEFAULT NULL");

    // Step 5: Add back foreign key constraint
    $db->query("ALTER TABLE categories_nested ADD CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories_nested(category_id) ON DELETE CASCADE");

    // Step 6: Update paths
    echo "Updating path values...\n";
    $db->query("UPDATE categories_nested SET path = CONCAT('/', category_id, '/') WHERE parent_id IS NULL");

    // For nested categories
    $db->query("UPDATE categories_nested c1 JOIN categories_nested c2 ON c1.parent_id = c2.category_id SET c1.path = CONCAT(c2.path, c1.category_id, '/') WHERE c1.parent_id IS NOT NULL");

    // Re-enable foreign key checks
    $db->query("SET FOREIGN_KEY_CHECKS = 1");

    echo "✅ Categories table fixed successfully!\n";
    echo "✅ Table now uses varchar(21) for category_id\n";
    echo "✅ You can now create categories with nanoid generation\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    if (isset($db)) {
        $db->query("SET FOREIGN_KEY_CHECKS = 1");
    }
}
