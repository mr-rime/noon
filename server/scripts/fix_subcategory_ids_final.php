<?php

require_once __DIR__ . '/../config/db.php';

try {
    echo "Fixing subcategory_id columns with foreign key constraints...\n";

    $db = new Database()->getConnection();
    $db->query("SET FOREIGN_KEY_CHECKS = 0");

    // Drop foreign key constraints first
    echo "Dropping foreign key constraints...\n";
    try {
        $db->query("ALTER TABLE products DROP FOREIGN KEY fk_products_subcategory");
    } catch (Exception $e) {
        echo "Foreign key fk_products_subcategory not found or already dropped\n";
    }
    try {
        $db->query("ALTER TABLE subcategories DROP FOREIGN KEY fk_subcategories_category");
    } catch (Exception $e) {
        echo "Foreign key fk_subcategories_category not found or already dropped\n";
    }

    // Fix subcategories.subcategory_id first (referenced table)
    echo "Updating subcategories.subcategory_id to varchar(21)...\n";
    $db->query("ALTER TABLE subcategories MODIFY COLUMN subcategory_id VARCHAR(21) NOT NULL");

    // Fix products.subcategory_id
    echo "Updating products.subcategory_id to varchar(21)...\n";
    $db->query("ALTER TABLE products MODIFY COLUMN subcategory_id VARCHAR(21) DEFAULT NULL");

    // Re-add foreign key constraints
    echo "Re-adding foreign key constraints...\n";
    $db->query("ALTER TABLE products ADD CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(subcategory_id) ON DELETE SET NULL");
    $db->query("ALTER TABLE subcategories ADD CONSTRAINT fk_subcategories_category FOREIGN KEY (category_id) REFERENCES categories_nested(category_id) ON DELETE CASCADE");

    $db->query("SET FOREIGN_KEY_CHECKS = 1");

    echo "✅ Fixed all subcategory_id columns!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $db->query("SET FOREIGN_KEY_CHECKS = 1");
}
