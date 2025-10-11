<?php
// Test script to debug category creation issues

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Category.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$db = new mysqli("localhost", "root", "", "noon_db");

if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}

echo "Database connected successfully\n";
echo "=================================\n\n";

// Test 1: Check if categories_nested table exists
echo "Test 1: Checking if categories_nested table exists...\n";
$result = $db->query("SHOW TABLES LIKE 'categories_nested'");
if ($result->num_rows > 0) {
    echo "✅ categories_nested table exists\n";
} else {
    echo "❌ categories_nested table does NOT exist\n";
    echo "Please run the migration script: fix_categories_and_products.sql\n";
    exit(1);
}

// Test 2: Check table structure
echo "\nTest 2: Checking table structure...\n";
$result = $db->query("DESCRIBE categories_nested");
echo "Table columns:\n";
while ($row = $result->fetch_assoc()) {
    echo "  - {$row['Field']} ({$row['Type']})\n";
}

// Test 3: Try to create a root category
echo "\nTest 3: Creating a root category...\n";
$categoryModel = new Category($db);

$testData = [
    'name' => 'Test Category ' . time(),
    'slug' => 'test-category-' . time(),
    'description' => 'This is a test category',
    'is_active' => true
];

echo "Creating category with data:\n";
print_r($testData);

$result = $categoryModel->create($testData);

if ($result) {
    echo "✅ Category created successfully!\n";
    echo "Created category:\n";
    print_r($result);
    
    // Test 4: Try to create a child category
    echo "\nTest 4: Creating a child category...\n";
    $childData = [
        'parent_id' => $result['category_id'],
        'name' => 'Test Child Category ' . time(),
        'slug' => 'test-child-category-' . time(),
        'description' => 'This is a test child category',
        'is_active' => true
    ];
    
    echo "Creating child category with data:\n";
    print_r($childData);
    
    $childResult = $categoryModel->create($childData);
    
    if ($childResult) {
        echo "✅ Child category created successfully!\n";
        echo "Created child category:\n";
        print_r($childResult);
    } else {
        echo "❌ Failed to create child category\n";
        echo "Last SQL error: " . $db->error . "\n";
    }
    
    // Clean up test categories
    echo "\nCleaning up test categories...\n";
    if (isset($childResult)) {
        $categoryModel->delete($childResult['category_id']);
    }
    $categoryModel->delete($result['category_id']);
    echo "✅ Test categories deleted\n";
} else {
    echo "❌ Failed to create category\n";
    echo "Last SQL error: " . $db->error . "\n";
    
    // Check if it's a duplicate slug issue
    $checkQuery = "SELECT * FROM categories_nested WHERE slug = ?";
    $stmt = $db->prepare($checkQuery);
    $stmt->bind_param('s', $testData['slug']);
    $stmt->execute();
    $existingResult = $stmt->get_result();
    
    if ($existingResult->num_rows > 0) {
        echo "⚠️ A category with this slug already exists\n";
    }
}

// Test 5: List all existing categories
echo "\nTest 5: Listing all existing categories...\n";
$allCategories = $categoryModel->findAll();
echo "Found " . count($allCategories) . " categories:\n";

foreach ($allCategories as $cat) {
    echo str_repeat("  ", $cat['level']) . "- {$cat['name']} (ID: {$cat['category_id']}, Level: {$cat['level']}, Path: {$cat['path']})\n";
}

// Test 6: Get category tree
echo "\nTest 6: Getting category tree...\n";
$tree = $categoryModel->getCategoryTree();
function printTree($categories, $indent = 0) {
    foreach ($categories as $cat) {
        echo str_repeat("  ", $indent) . "- {$cat['name']} (ID: {$cat['category_id']})\n";
        if (isset($cat['children']) && count($cat['children']) > 0) {
            printTree($cat['children'], $indent + 1);
        }
    }
}
printTree($tree);

$db->close();
echo "\n=================================\n";
echo "All tests completed!\n";
