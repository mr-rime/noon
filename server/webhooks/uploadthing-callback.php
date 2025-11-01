<?php

require_once __DIR__ . '/../vendor/autoload.php';


if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

header('Content-Type: application/json');

try {

    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Invalid JSON data received');
    }


    error_log('UploadThing callback received: ' . json_encode($data));

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Callback received successfully'
    ]);

} catch (Exception $e) {
    error_log('UploadThing callback error: ' . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
