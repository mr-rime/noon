<?php

require_once __DIR__ . '/../config/db.php';

try {
    echo "Fixing subcategory_id columns...\n";

    $db = new Database()->getConnection();
    $db->query("SET FOREIGN_KEY_CHECKS = 0");

    // Fix products.subcategory_id
    echo "Updating products.subcategory_id to varchar(21)...\n";
    $db->query("ALTER TABLE products MODIFY COLUMN subcategory_id VARCHAR(21) DEFAULT NULL");

    // Fix subcategories.subcategory_id
    echo "Updating subcategories.subcategory_id to varchar(21)...\n";
    $db->query("ALTER TABLE subcategories MODIFY COLUMN subcategory_id VARCHAR(21) NOT NULL");

    $db->query("SET FOREIGN_KEY_CHECKS = 1");

    echo "✅ Fixed all subcategory_id columns!\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $db->query("SET FOREIGN_KEY_CHECKS = 1");
}
