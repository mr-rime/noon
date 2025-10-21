<?php

require_once __DIR__ . '/../config/db.php';

$db = new Database()->getConnection();

echo "Checking all tables for category-related columns:\n\n";

$result = $db->query('SHOW TABLES');
while ($row = $result->fetch_row()) {
    $table = $row[0];
    $columns = $db->query('SHOW COLUMNS FROM `' . $table . '` WHERE Field LIKE "%category%"');

    while ($col = $columns->fetch_assoc()) {
        echo $table . '.' . $col['Field'] . ' - ' . $col['Type'] . "\n";


        if (strpos($col['Type'], 'int') !== false) {
            echo "  ❌ NEEDS FIX: " . $table . "." . $col['Field'] . " is still " . $col['Type'] . "\n";
        }
    }
}
