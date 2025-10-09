<?php
// Fix NULL is_public values in products table
require_once __DIR__ . '/../config/db.php';

try {
    // Update any NULL is_public values to 0 (false/private)
    $query = "UPDATE `products` SET `is_public` = 0 WHERE `is_public` IS NULL";
    $result = $db->query($query);
    
    if ($result) {
        echo "Successfully updated NULL is_public values to 0\n";
        
        // Check how many rows were affected
        echo "Rows affected: " . $db->affected_rows . "\n";
        
        // Verify no NULL values remain
        $checkQuery = "SELECT COUNT(*) as null_count FROM `products` WHERE `is_public` IS NULL";
        $checkResult = $db->query($checkQuery);
        $row = $checkResult->fetch_assoc();
        
        echo "Remaining NULL is_public values: " . $row['null_count'] . "\n";
        
        if ($row['null_count'] == 0) {
            echo "✅ All NULL is_public values have been fixed!\n";
        } else {
            echo "⚠️ Some NULL values still remain\n";
        }
        
    } else {
        echo "❌ Error updating is_public values: " . $db->error . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
}

$db->close();
?>
