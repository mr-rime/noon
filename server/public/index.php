<?php


$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowed_origins = [
    'http://localhost:5173',
    'http://dashboard.localhost:5173'
];

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}


header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


header("Content-Type: application/json");


require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/session.php';


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/graphql') {
    require_once __DIR__ . '/../routes/graphql.php';
    exit;
}

if ($uri === '/webhooks/stripe-webhook') {
    require_once __DIR__ . '/../webhooks/stripe-webhook.php';
    exit;
}


http_response_code(404);
echo json_encode([
    'error' => 'Route not found!'
]);
