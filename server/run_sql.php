<?php
require_once __DIR__ . '/config/db.php';

$database = new Database();
$db = $database->getConnection();

$sql = file_get_contents(__DIR__ . '/database/coupons.sql');

if ($db->multi_query($sql)) {
    echo "Table created successfully";
} else {
    echo "Error creating table: " . $db->error;
}
