<?php

use GraphQL\GraphQL;
use GraphQL\Error\FormattedError;
use GraphQL\Error\DebugFlag;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

$db = new Database();
$conn = $db->getConnection();

$schema = require_once __DIR__ . '/../graphql/schema.php';

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
$query = $input['query'] ?? null;
$variables = $input['variables'] ?? [];

try {
    $result = GraphQL::executeQuery($schema, $query, null, ['db' => $conn], $variables);
    $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE);
} catch (Throwable $err) {
    http_response_code(500);
    $output = ['error' => FormattedError::createFromException($err)];
}

echo json_encode($output);
