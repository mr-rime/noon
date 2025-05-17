<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/session.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/graphql') {
    require_once __DIR__ . '/../routes/graphql.php';
    exit;
} else {
    http_response_code(404);

    echo json_encode([
        'error' => 'Route not found!'
    ]);
}